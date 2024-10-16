import {
  BasePlugin,
  DependencyInjectionConfigureEvent,
  IDependencyInjectionConfigureEventListener,
  Parallel,
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
    await Parallel.forEach(Object.entries(discoveryResult), async ([definition, managers]) => {
      await Parallel.forEach(managers, async (manager) => {
        event.managers.add(definition, {
          interafaceClass: manager.interfacePath,
          managerClass: manager.path,
        });
      });
    });
    // for (const [definition, managers] of Object.entries(discoveryResult)) {
    //   for (const manager of managers) {
    //     event.managers.add(definition, {
    //       interafaceClass: manager.interfacePath,
    //       managerClass: manager.path,
    //     });
    //   }
    // }
  }

  log(): void {
    //super.log('Discovery Plugin');
  }

  name(): string {
    return 'Discovery Manager';
  }
}
