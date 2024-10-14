import { WebApplicationConfigureEvent } from './WebApplicationConfigureEvent';

export interface IWebApplicationConfigureEventListener {
  executeWebApplicationConfigureAsync(
    event: WebApplicationConfigureEvent,
  ): Promise<void>;
}
