import { ListDefinitionResult } from "../../../Result/Gateway/Definition/ListDefinitionResult";
import { IDefinitionManager } from "../../../IManager/Gateway/Definition/IDefinitionManager";
import { CreateDefinitionPayload } from "../../../IManager/Gateway/Definition/Payload/CreateDefinitionPayload";

export class DefinitionManager implements IDefinitionManager {
  private _definitions: string[];

  constructor() {
    this._definitions = [];
  }

  async listAsync(): Promise<ListDefinitionResult[]> {
    return this._definitions.map((definition) => ({
      name: definition,
    }));
  }

  async createAsync(payload: CreateDefinitionPayload): Promise<void> {
    this._definitions.push(payload.name);
  }
}
