import { DependencyContainer } from '../../../../index';
import { BaseEvent } from '../../BaseEvent';

export class PostDependencyInjectionConfigureEvent extends BaseEvent {
  container: DependencyContainer;

  constructor(context: string[], container: DependencyContainer) {
    super(context);
    this.container = container;
  }
}
