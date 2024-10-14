import { EventListener } from '../../../Application/EventListener/EventListener';

export interface TriggerEventPayload<T> {
  plugins: string[];
  eventListener?: EventListener;
  event: () => Promise<T>;
  onCreate?: (plugin: string) => Promise<void>;
  onSuccess?: (event: T) => Promise<void>;
}
