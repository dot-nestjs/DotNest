import { WebApplicationPostStartupEvent } from './WebApplicationPostStartupEvent';

export interface IWebApplicationPostStartupEventListener {
  executeWebApplicationPostStartupAsync(
    event: WebApplicationPostStartupEvent,
  ): Promise<void>;
}
