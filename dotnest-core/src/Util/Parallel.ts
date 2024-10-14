import * as fs from 'fs';

export class Parallel {
  public static async fileExistAsync(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath); // Resolves if the file exists
      return true;
    } catch {}
    return false;
  }

  public static async forEach<T>(
    items: T[],
    callback: (item: T) => Promise<void>,
  ): Promise<void> {
    await Promise.all(items.map((item) => callback(item)));
  }
}
