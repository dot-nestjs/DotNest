import { Type } from '@nestjs/common';
import {
  BasePlugin,
  DependencyInjectionConfigureEvent,
  DotNestApplicationPreStartupEvent,
  EventType,
  IDependencyInjectionConfigureEventListener,
  IDotNestApplicationPreStartupEventListener,
  IWebApplicationPostStartupEventListener,
  IWebApplicationPreStartupEventListener,
  WebApplicationPostStartupEvent,
  WebApplicationPreStartupEvent,
} from '..';
import { TriggerEventPayload } from './Payload/TriggerEventPayload';
import { Core } from '../../Core';
import { Parallel } from '../../Util';

export class EventTrigger {
  public static async executeAllDependencyInjectionConfigureAsync(
    payload: TriggerEventPayload<DependencyInjectionConfigureEvent>,
  ): Promise<void> {
    await Promise.all(
      payload.plugins.map((plugin) =>
        this.executeDependencyInjectionConfigureAsync(plugin, payload),
      ),
    );
  }

  private static async executeDependencyInjectionConfigureAsync(
    plugin: string,
    payload: TriggerEventPayload<DependencyInjectionConfigureEvent>,
  ): Promise<void> {
    const pluginType: Type<BasePlugin> = await Core.activeAsync(plugin);
    const pluginInstance = new pluginType();
    if (payload.onCreate != undefined) {
      await payload.onCreate(plugin);
    }
    if ('executeDependencyInjectionConfigureAsync' in pluginInstance) {
      const listener = pluginInstance as BasePlugin &
        IDependencyInjectionConfigureEventListener;
      listener.log('Execute Dependency Injection Configure');
      const event = await payload.event();
      await listener.executeDependencyInjectionConfigureAsync(event);
      if (payload.onSuccess != undefined) {
        await payload.onSuccess(event);
      }
    }
  }

  public static async executeAllDotNestApplicationPreStartupAsync(
    payload: TriggerEventPayload<DotNestApplicationPreStartupEvent>,
  ): Promise<void> {
    await Promise.all(
      payload.plugins.map((plugin) =>
        this.executeDotNestApplicationPreStartupAsync(plugin, payload),
      ),
    );
  }

  private static async executeDotNestApplicationPreStartupAsync(
    plugin: string,
    payload: TriggerEventPayload<DotNestApplicationPreStartupEvent>,
  ): Promise<void> {
    const pluginType: Type<BasePlugin> = await Core.activeAsync(plugin);
    const pluginInstance = new pluginType();
    if (payload.onCreate != undefined) {
      await payload.onCreate(plugin);
    }
    if ('executeDotNestApplicationPreStartupAsync' in pluginInstance) {
      const listener = pluginInstance as BasePlugin &
        IDotNestApplicationPreStartupEventListener;
      listener.log('Execute DotNest Application Pre Startup');
      const event = await payload.event();
      await listener.executeDotNestApplicationPreStartupAsync(event);
      if (payload.onSuccess != undefined) {
        await payload.onSuccess(event);
      }
    }
  }

  public static async executeAllWebApplicationPostStartupAsync(
    payload: TriggerEventPayload<WebApplicationPostStartupEvent>,
  ): Promise<void> {
    await Promise.all(
      payload.plugins.map((plugin) =>
        this.executeWebApplicationPostStartupAsync(plugin, payload),
      ),
    );
  }

  private static async executeWebApplicationPostStartupAsync(
    plugin: string,
    payload: TriggerEventPayload<WebApplicationPostStartupEvent>,
  ): Promise<void> {
    const pluginType: Type<BasePlugin> = await Core.activeAsync(plugin);
    const pluginInstance = new pluginType();
    if (payload.onCreate != undefined) {
      await payload.onCreate(plugin);
    }
    if ('executeWebApplicationPostStartupAsync' in pluginInstance) {
      const listener = pluginInstance as BasePlugin &
        IWebApplicationPostStartupEventListener;
      listener.log('Execute WebApplication Post Startup');
      const event = await payload.event();
      await listener.executeWebApplicationPostStartupAsync(event);
      if (payload.onSuccess != undefined) {
        await payload.onSuccess(event);
      }
    }
  }

  public static async executeAllWebApplicationPreStartupAsync(
    payload: TriggerEventPayload<WebApplicationPreStartupEvent>,
  ): Promise<void> {
    const eventListener = payload.eventListener;
    if (eventListener != undefined) {
      await Parallel.forEach(
        eventListener.getListeners(EventType.WebApplicationPreStartup),
        async (listener) => {
          const event = await payload.event();
          await listener(event);
          if (payload.onSuccess != undefined) {
            await payload.onSuccess(event);
          }
        },
      );
    }
    await Promise.all(
      payload.plugins.map((plugin) =>
        this.executeWebApplicationPreStartupAsync(plugin, payload),
      ),
    );
  }

  private static async executeWebApplicationPreStartupAsync(
    plugin: string,
    payload: TriggerEventPayload<WebApplicationPreStartupEvent>,
  ): Promise<void> {
    const pluginType: Type<BasePlugin> = await Core.activeAsync(plugin);
    const pluginInstance = new pluginType();
    if (payload.onCreate != undefined) {
      await payload.onCreate(plugin);
    }
    if ('executeWebApplicationPreStartupAsync' in pluginInstance) {
      const listener = pluginInstance as BasePlugin &
        IWebApplicationPreStartupEventListener;
      listener.log('Execute WebApplication Pre Startup');
      const event = await payload.event();
      await listener.executeWebApplicationPreStartupAsync(event);
      if (payload.onSuccess != undefined) {
        await payload.onSuccess(event);
      }
    }
  }
}
