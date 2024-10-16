import { Controller, Get, Param } from "@nestjs/common";
import { GatewayController } from "../GatewayController";
import { ISwaggerManager } from "../../../../IManager/Gateway/Swagger/ISwaggerManager";

@Controller("swagger-json")
export class SwaggerController implements GatewayController {
  constructor(private readonly _swaggerManager: ISwaggerManager) {}

  @Get(":definition")
  async getAsync(@Param("definition") definition: string): Promise<string> {
    return await this._swaggerManager.detailAsync({
      definition: definition,
    });
  }
}
