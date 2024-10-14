import { DependencyContainer } from './Dependency';
import {
  Core,
  DependencyInjectionConfigureEvent,
  EventTrigger,
  Parallel,
} from '../index';
import { Controller } from '../Plugin/Event/DependencyInjection/Configure/Controller';
import { StartDotNestApplicationPayload } from './Payload/StartDotNestApplicationPayload';
import { DotNestApplicationMode } from './Payload/DotNestApplicationMode';
import { Manager } from '../Plugin/Event/DependencyInjection/Configure/Manager';
import * as path from 'path';
import * as fs from 'fs';
import { EventListener } from './EventListener/EventListener';

export class DotNestApplication {
  private readonly _dependency: Record<string, DependencyContainer>;
  private readonly _internalPlugins: string[];
  private readonly _plugins: string[];
  public eventListener: EventListener;

  constructor(private context: string[]) {
    this._dependency = {};
    this._internalPlugins = [];
    this._plugins = [];
    if (this.context.length === 0) {
      const cwd = path.join(process.cwd(), 'dist');
      this.context.push(cwd);
    }
    this.eventListener = new EventListener();
  }

  private async loadInternalPlugins(): Promise<void> {
    const internalPluginDir = path.join(__dirname, 'Internal', 'Plugin');
    const internalPlugins = await fs.promises.readdir(internalPluginDir, {
      withFileTypes: true,
    });

    await Parallel.forEach(internalPlugins, async (plugin) => {
      if (plugin.isDirectory()) {
        const entry = path.join(internalPluginDir, plugin.name, 'Plugin.js');
        if (await Parallel.fileExistAsync(entry)) {
          this._internalPlugins.push(entry);
        }
      }
    });
  }

  public async start(payload: StartDotNestApplicationPayload): Promise<void> {
    await this.loadInternalPlugins();

    await EventTrigger.executeAllDotNestApplicationPreStartupAsync({
      plugins: this._internalPlugins,
      eventListener: this.eventListener,
      event: async () => {
        return {
          context: this.context,
          plugins: [],
        };
      },
      onCreate: async (plugin) => {
        //this._plugins.unshift(plugin);
      },
      onSuccess: async (event) => {
        for (const plugin of event.plugins) {
          this._plugins.unshift(plugin);
        }
      },
    });
    await Parallel.forEach(this._internalPlugins, async (plugin) => {
      this._plugins.unshift(plugin);
    });

    await EventTrigger.executeAllDependencyInjectionConfigureAsync({
      plugins: this._plugins,
      eventListener: this.eventListener,
      event: async () => {
        const dependency: Record<string, DependencyContainer> = {};
        return {
          context: this.context,
          dependency: dependency,
          controllers: new Controller(dependency),
          managers: new Manager(dependency),
        };
      },
      onSuccess: async (event) => {
        for (const [definition, container] of Object.entries(
          event.dependency,
        )) {
          if (this._dependency[definition] == undefined) {
            this._dependency[definition] = new DependencyContainer();
          }
          this._dependency[definition].controllers.push(
            ...container.controllers,
          );
          this._dependency[definition].managers.push(...container.managers);
        }
      },
    });

    switch (payload.mode) {
      case DotNestApplicationMode.Application:
        for (const [definition, container] of Object.entries(
          this._dependency,
        )) {
          for (const plugin of this._plugins) {
            container.plugins.push({
              pluginClass: plugin,
            });
          }
          await Core.Start({
            name: definition,
            container: container,
            useSocket: true,
            context: this.context,
            eventListener: this.eventListener,
          });
        }
        break;
      case DotNestApplicationMode.Gateway:
        const dependencyContainer = new DependencyContainer();
        for (const [definition, container] of Object.entries(
          this._dependency,
        )) {
          dependencyContainer.controllers.push(...container.controllers);
          dependencyContainer.managers.push(...container.managers);
        }
        for (const plugin of this._plugins) {
          dependencyContainer.plugins.push({
            pluginClass: plugin,
          });
        }
        await Core.Start({
          name: 'Gateway',
          container: dependencyContainer,
          useSocket: false,
          context: this.context,
          eventListener: this.eventListener,
        });
        break;
    }
  }

  getDefinitions(): string[] {
    return Object.keys(this._dependency);
  }
}
