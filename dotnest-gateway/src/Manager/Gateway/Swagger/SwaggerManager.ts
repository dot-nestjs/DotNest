import { Injectable } from "@nestjs/common/decorators";
import { IProxyManager } from "src/IManager/Gateway/Proxy/IProxyManager";
import { ISwaggerManager } from "src/IManager/Gateway/Swagger/ISwaggerManager";
import { SwaggerDetailPayload } from "src/IManager/Gateway/Swagger/Payload/SwaggerDetailPayload";

@Injectable()
export class SwaggerManager implements ISwaggerManager {
  constructor(private readonly _proxyManager: IProxyManager) {}
  async detailAsync(payload: SwaggerDetailPayload): Promise<string> {
    return await this._proxyManager.executeRequestAsync({
      definition: payload.definition,
      route: "swagger-json",
    });
  }
}
