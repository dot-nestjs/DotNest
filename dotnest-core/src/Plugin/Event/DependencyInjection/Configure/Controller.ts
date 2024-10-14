import { DependencyContainer } from '../../../../index';

export class Controller {
  constructor(public _dependency: Record<string, DependencyContainer>) {}
  add(
    definition: string,
    ...controllers: DependencyContainer['controllers']
  ): void {
    if (this._dependency[definition] == undefined) {
      this._dependency[definition] = new DependencyContainer();
    }
    for (const controller of controllers) {
      this._dependency[definition].controllers.push(controller);
    }
  }
}
