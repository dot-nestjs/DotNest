import { clc } from "@nestjs/common/utils/cli-colors.util";
import { Logger } from "../Logger";

export abstract class BasePlugin {
  private readonly _logger: Logger;

  constructor() {
    this._logger = new Logger(
      `${clc.green("[")}${clc.red("Dot")}${clc.green(`Nest - Plugin]`)}\t`
    );
  }

  log(message: string): void {
    this._logger.log(`${clc.yellow(`[${this.name()}]`)} ${clc.green(message)}`);
  }

  error(message: string): void {
    this._logger.error(`${clc.yellow(`[${this.name()}]`)} ${clc.red(message)}`);
  }

  async enable(): Promise<boolean> {
    return true;
  }

  abstract name(): string;
}
