import { createConnection } from "net";
import { IProxyManager } from "../../../IManager/Gateway/Proxy/IProxyManager";
import * as path from "path";
import * as fs from "fs";
import { RequestPayload } from "../../../IManager/Gateway/Proxy/Payload/RequestPayload";

export class ProxyManager implements IProxyManager {
  async getAsync(payload: RequestPayload): Promise<string> {
    return await this.executeRequestAsync({
      definition: payload.definition,
      route: `api/${payload.definition}/${payload.route}`,
    });
  }

  executeRequestAsync(payload: RequestPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const socketPath = path.join(
        process.cwd(),
        "dist",
        "socks",
        `${payload.definition}.sock`
      );
      if (fs.existsSync(socketPath)) {
        const client = createConnection(socketPath, () => {
          const request =
            `GET /${payload.route} HTTP/1.1\r\n` +
            `Host: localhost\r\n` +
            `Connection: close\r\n\r\n`;
          client.write(request);
        });

        let responseData = "";
        let headersEnded = false;
        client.on("data", (data) => {
          responseData += data.toString();
          if (!headersEnded) {
            const headerEndIndex = responseData.indexOf("\r\n\r\n");
            if (headerEndIndex !== -1) {
              headersEnded = true;
              const body = responseData.substring(headerEndIndex + 4);
              resolve(body);
            }
          }
        });

        // Handle errors
        client.on("error", (err) => {
          console.error("Connection error:", err);
          reject(err); // Reject the promise on error
        });

        // Handle close event
        client.on("end", () => {});
      } else {
        reject("definition not found");
      }
    });
  }
}
