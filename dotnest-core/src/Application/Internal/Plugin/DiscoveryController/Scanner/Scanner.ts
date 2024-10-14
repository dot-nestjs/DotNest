import { ControllerResult } from './Result/ControllerResult';
import * as fs from 'fs';
import * as path from 'path';

export class Scanner {
  public static async scanAsync(
    context: string,
    dir = 'Controller',
  ): Promise<Record<string, ControllerResult[]>> {
    const result: Record<string, ControllerResult[]> = {};
    const controllerDir = path.join(context, dir);
    if (fs.existsSync(controllerDir)) {
      const definitions = await fs.promises.readdir(controllerDir, {
        withFileTypes: true,
      });
      for (const definition of definitions) {
        if (definition.isDirectory()) {
          result[definition.name] = [];

          const versionDir = path.join(controllerDir, definition.name);
          const versions = await fs.promises.readdir(versionDir, {
            withFileTypes: true,
          });

          for (const version of versions) {
            if (version.isDirectory()) {
              const featureDir = path.join(versionDir, version.name);
              const features = await fs.promises.readdir(featureDir, {
                withFileTypes: true,
              });

              for (const feature of features) {
                if (feature.isDirectory()) {
                  const controllerDir = path.join(featureDir, feature.name);
                  const controllers = await fs.promises.readdir(controllerDir, {
                    withFileTypes: true,
                  });
                  for (const controller of controllers) {
                    if (
                      controller.isFile() &&
                      controller.name.endsWith('Controller.js')
                    ) {
                      result[definition.name].push({
                        version: version.name,
                        feature: feature.name,
                        name: controller.name,
                        path: path.join(controllerDir, controller.name),
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return result;
  }
}
