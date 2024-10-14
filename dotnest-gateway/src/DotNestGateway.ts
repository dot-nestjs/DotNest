import {
  DotNestApplication,
  DotNestApplicationMode,
  EventType,
  WebApplicationPreStartupEvent,
} from "@dotnest/core";
import { IDefinitionManager } from "./IManager/Gateway/Definition/IDefinitionManager";

export class DotNestGateway {
  static async Proxy(application: DotNestApplication): Promise<void> {
    const definitions = application.getDefinitions();
    const gateway = new DotNestApplication([__dirname]);
    gateway.eventListener.addListener(
      EventType.WebApplicationPreStartup,
      async (event: WebApplicationPreStartupEvent) => {
        const definitionManager = await event.webApplication.resolve(
          IDefinitionManager
        );
        for (const definition of definitions) {
          await definitionManager.createAsync({
            name: definition,
          });
        }
      }
    );
    await gateway.start({
      mode: DotNestApplicationMode.Gateway,
    });
  }
}
