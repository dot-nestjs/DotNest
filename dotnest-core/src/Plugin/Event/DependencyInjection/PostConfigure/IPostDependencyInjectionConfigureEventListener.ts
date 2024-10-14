import { PostDependencyInjectionConfigureEvent } from './PostDependencyInjectionConfigureEvent';

export interface IPostDependencyInjectionConfigureEventListener {
  executePostDependencyInjectionConfigureAsync(
    event: PostDependencyInjectionConfigureEvent,
  ): Promise<void>;
}
