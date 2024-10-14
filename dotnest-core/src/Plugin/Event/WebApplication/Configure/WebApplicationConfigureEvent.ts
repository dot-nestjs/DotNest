import { MiddlewareConsumer } from '@nestjs/common';
import { DependencyContainer } from '../../../../index';
import { BaseEvent } from '../../BaseEvent';

export class WebApplicationConfigureEvent extends BaseEvent {
  middlewareConsumer: MiddlewareConsumer;
  container: DependencyContainer;

  constructor(
    context: string[],
    middlewareConsumer: MiddlewareConsumer,
    container: DependencyContainer,
  ) {
    super(context);
    this.middlewareConsumer = middlewareConsumer;
    this.container = container;
  }
}
