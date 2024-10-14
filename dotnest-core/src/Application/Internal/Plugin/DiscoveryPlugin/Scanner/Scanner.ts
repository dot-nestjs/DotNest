import { PluginResult } from './Result/PluginResult';
import * as fs from 'fs';
import * as path from 'path';

export class Scanner {
  public static async scanAsync(
    context: string,
    dir = 'Plugin',
  ): Promise<PluginResult[]> {
    const result: PluginResult[] = [];
    const pluginDir = path.join(context, dir);
    if (fs.existsSync(pluginDir)) {
      const features = await fs.promises.readdir(pluginDir, {
        withFileTypes: true,
      });
      for (const feature of features) {
        if (feature.isDirectory()) {
          const featureDir = path.join(pluginDir, feature.name);
          const pluginEntry = path.join(featureDir, 'Plugin.js');
          if (fs.existsSync(pluginEntry)) {
            result.push({
              feature: feature.name,
              name: 'Plugin.js',
              path: pluginEntry,
            });
          }
        }
      }
    }
    return result;
  }
}
