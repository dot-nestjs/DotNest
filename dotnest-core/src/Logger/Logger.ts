import { ConsoleLogger } from '@nestjs/common';

export class Logger extends ConsoleLogger {
  constructor(public logo: string) {
    super();
  }

  protected formatPid(pid: number) {
    return `${this.logo} ${pid}  - `;
  }
}
