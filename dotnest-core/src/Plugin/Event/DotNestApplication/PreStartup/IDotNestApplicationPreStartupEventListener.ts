import { DotNestApplicationPreStartupEvent } from './DotNestApplicationPreStartupEvent';

export interface IDotNestApplicationPreStartupEventListener {
  executeDotNestApplicationPreStartupAsync(
    event: DotNestApplicationPreStartupEvent,
  ): Promise<void>;
}
