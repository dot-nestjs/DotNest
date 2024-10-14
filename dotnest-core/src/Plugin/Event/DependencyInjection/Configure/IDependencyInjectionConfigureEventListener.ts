import { DependencyInjectionConfigureEvent } from './DependencyInjectionConfigureEvent';

export interface IDependencyInjectionConfigureEventListener {
  executeDependencyInjectionConfigureAsync(
    event: DependencyInjectionConfigureEvent,
  ): Promise<void>;
}
