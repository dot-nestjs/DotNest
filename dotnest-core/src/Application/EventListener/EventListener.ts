import { BaseEvent, EventType } from '../../index';

export class EventListener {
  private readonly listeners: Record<
    EventType,
    ((event: BaseEvent) => Promise<void>)[]
  >;

  constructor() {
    this.listeners = {
      [EventType.DependencyInjectionConfigure]: [],
      [EventType.DependencyInjectionPostConfigure]: [],
      [EventType.WebApplicationConfigure]: [],
      [EventType.WebApplicationPreStartup]: [],
      [EventType.WebApplicationPostStartup]: [],
    };
  }

  addListener(event: EventType, listener: (event: BaseEvent) => Promise<void>) {
    this.listeners[event].push(listener);
  }

  removeListener(
    event: EventType,
    listener: (event: BaseEvent) => Promise<void>,
  ) {
    const index = this.listeners[event].indexOf(listener);
    if (index !== -1) {
      this.listeners[event].splice(index, 1);
    }
  }

  getListeners(event: EventType): ((event: BaseEvent) => Promise<void>)[] {
    return this.listeners[event];
  }
}
