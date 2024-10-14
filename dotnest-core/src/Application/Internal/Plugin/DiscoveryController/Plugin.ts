import {
  BasePlugin,
  DependencyInjectionConfigureEvent,
  IDependencyInjectionConfigureEventListener,
} from '../../../../index';
import { Scanner } from './Scanner/Scanner';

export class Plugin
  extends BasePlugin
  implements IDependencyInjectionConfigureEventListener
{
  async executeDependencyInjectionConfigureAsync(
    event: DependencyInjectionConfigureEvent,
  ): Promise<void> {
    const discoveryResult = await Scanner.scanAsync(event.context[0]);
    for (const [definition, controllers] of Object.entries(discoveryResult)) {
      for (const controller of controllers) {
        event.controllers.add(definition, {
          controllerClass: controller.path,
        });
      }
    }
  }

  log(): void {
    //super.log('Discovery Plugin');
  }

  name(): string {
    return 'Discovery Controller';
  }
}
