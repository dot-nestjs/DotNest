import { DependencyContainer } from '../../../../index';

export class Manager {
  constructor(public _dependency: Record<string, DependencyContainer>) {}

  add(definition: string, ...managers: DependencyContainer['managers']): void {
    if (this._dependency[definition] == undefined) {
      this._dependency[definition] = new DependencyContainer();
    }
    for (const manager of managers) {
      this._dependency[definition].managers.push(manager);
    }
  }
}
