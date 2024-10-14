import { DependencyContainer } from '../../../../index';
import { Controller } from './Controller';
import { Manager } from './Manager';
import { BaseEvent } from '../../BaseEvent';

export class DependencyInjectionConfigureEvent extends BaseEvent {
  dependency: Record<string, DependencyContainer>;
  controllers: Controller;
  managers: Manager;

  constructor(
    context: string[],
    dependency: Record<string, DependencyContainer>,
  ) {
    super(context);
    this.dependency = dependency;
    this.controllers = new Controller(this.dependency);
    this.managers = new Manager(this.dependency);
  }
}
