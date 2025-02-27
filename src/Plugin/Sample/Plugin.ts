import {
  BasePlugin,
  DependencyInjectionConfigureEvent,
  IDependencyInjectionConfigureEventListener,
} from "@dotnest/core";

export class Plugin
  extends BasePlugin
  implements IDependencyInjectionConfigureEventListener
{
  async executeDependencyInjectionConfigureAsync(
    event: DependencyInjectionConfigureEvent
  ): Promise<void> {
    this.log("runed sample");
  }

  name(): string {
    return "Sample";
  }
}
