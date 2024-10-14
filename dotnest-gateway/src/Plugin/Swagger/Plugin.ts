import {
  BasePlugin,
  IWebApplicationPreStartupEventListener,
  WebApplicationPreStartupEvent,
} from "@dotnest/core";
import * as swaggerUi from "swagger-ui-express";
import { IDefinitionManager } from "../../IManager/Gateway/Definition/IDefinitionManager";

export class Plugin
  extends BasePlugin
  implements IWebApplicationPreStartupEventListener
{
  name(): string {
    return "Swagger";
  }

  async executeWebApplicationPreStartupAsync(
    event: WebApplicationPreStartupEvent
  ): Promise<void> {
    const definitionManager = await event.webApplication.resolve(
      IDefinitionManager
    );
    const definitions = await definitionManager.listAsync();

    const options = {
      explorer: true,
      swaggerOptions: {
        urls: definitions.map((definition) => {
          return {
            url: `/swagger-json/${definition.name}`,
            name: definition.name,
          };
        }),
      },
    };

    event.webApplication.use(
      "/swagger",
      swaggerUi.serve,
      swaggerUi.setup(null, options)
    );
  }
}
