import { BaseEvent } from '../../BaseEvent';

export class DotNestApplicationPreStartupEvent extends BaseEvent {
  plugins: string[];

  constructor(context: string[], plugins: string[]) {
    super(context);
    this.plugins = plugins;
  }
}
