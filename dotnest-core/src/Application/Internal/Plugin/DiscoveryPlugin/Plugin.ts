import {
  BasePlugin,
  IDotNestApplicationPreStartupEventListener,
  DotNestApplicationPreStartupEvent,
  Parallel,
} from '../../../../index';
import { Scanner } from './Scanner/Scanner';

export class Plugin
  extends BasePlugin
  implements IDotNestApplicationPreStartupEventListener
{
  async executeDotNestApplicationPreStartupAsync(
    event: DotNestApplicationPreStartupEvent,
  ): Promise<void> {
    await Parallel.forEach(event.context, async (context) => {
      const discoveryResult = await Scanner.scanAsync(context);
      for (const plugin of discoveryResult) {
        event.plugins.push(plugin.path);
      }
    });
  }

  log(): void {
    //super.log('Discovery Plugin');
  }

  name(): string {
    return 'Discovery Plugin';
  }
}
