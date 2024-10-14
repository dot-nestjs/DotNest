import { DependencyContainer } from '../../index';
import { EventListener } from '../../Application/EventListener/EventListener';

export interface StartPayload {
  name: string;
  context: string[];
  container: DependencyContainer;
  eventListener: EventListener;
  useSocket?: boolean;
}
