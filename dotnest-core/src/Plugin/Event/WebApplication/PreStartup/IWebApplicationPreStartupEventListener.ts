import { WebApplicationPreStartupEvent } from './WebApplicationPreStartupEvent';

export interface IWebApplicationPreStartupEventListener {
  executeWebApplicationPreStartupAsync(
    event: WebApplicationPreStartupEvent,
  ): Promise<void>;
}
