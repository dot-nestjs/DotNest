import { Injectable } from "@nestjs/common/decorators";
import { IProxyManager } from "../../../IManager/Gateway/Proxy/IProxyManager";
import { ISwaggerManager } from "../../../IManager/Gateway/Swagger/ISwaggerManager";
import { SwaggerDetailPayload } from "../../../IManager/Gateway/Swagger/Payload/SwaggerDetailPayload";

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
