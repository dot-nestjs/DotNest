import { Controller, Get, Param } from "@nestjs/common";
import { GatewayController } from "../GatewayController";
import { StandardResult } from "../../../../Result/Gateway/Proxy/StandardResult";
import { IProxyManager } from "../../../../IManager/Gateway/Proxy/IProxyManager";

@Controller("api")
export class ProxyController implements GatewayController {
  constructor(private readonly _proxyManager: IProxyManager) {}

  @Get(":definition/*")
  async getAsync(
    @Param("definition") definition: string,
    @Param("0") route: string
  ): Promise<StandardResult<string>> {
    return {
      data: await this._proxyManager.getAsync({
        definition: definition,
        route: route,
      }),
      status: 200,
      errorMessages: null,
    };
  }
}
