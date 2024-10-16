import { ManagerResult } from './Result/ManagerResult';
import * as fs from 'fs';
import * as path from 'path';

export class Scanner {
  public static async scanAsync(
    context: string,
    imanagerDir = 'IManager',
    managerDir = 'Manager',
  ): Promise<Record<string, ManagerResult[]>> {
    const result: Record<string, ManagerResult[]> = {};
    const interfaceDir = path.join(context, imanagerDir);
    if (fs.existsSync(interfaceDir)) {
      const definitions = await fs.promises.readdir(interfaceDir, {
        withFileTypes: true,
      });
      for (const definition of definitions) {
        if (definition.isDirectory()) {
          result[definition.name] = [];

          const featureDir = path.join(interfaceDir, definition.name);
          const features = await fs.promises.readdir(featureDir, {
            withFileTypes: true,
          });
          for (const feature of features) {
            if (feature.isDirectory()) {
              const interfaceDir = path.join(featureDir, feature.name);
              const interfaces = await fs.promises.readdir(interfaceDir, {
                withFileTypes: true,
              });
              for (const interfaceClass of interfaces) {
                if (interfaceClass.isFile()) {
                  const interfaceName = interfaceClass.name;
                  if (
                    interfaceName.startsWith('I') &&
                    interfaceName.endsWith('Manager.js')
                  ) {
                    const managerClass = path.join(
                      context,
                      managerDir,
                      definition.name,
                      feature.name,
                      interfaceName.substring(1),
                    );
                    if (fs.existsSync(managerClass)) {
                      result[definition.name].push({
                        feature: feature.name,
                        name: interfaceName,
                        interfacePath: path.join(interfaceDir, interfaceName),
                        path: managerClass,
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
