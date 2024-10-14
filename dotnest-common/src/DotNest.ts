import { DotNestApplication, DotNestApplicationMode } from "@dotnest/core";
import { DotNestGateway } from "@dotnest/gateway";
import * as path from "path";

export class DotNest {
  static async WebApplication(): Promise<void> {
    const application = new DotNestApplication([
      path.join(process.cwd(), "dist"),
      __dirname,
    ]);
    await application.start({
      mode: DotNestApplicationMode.Application,
    });
    await DotNestGateway.Proxy(application);
  }
}
