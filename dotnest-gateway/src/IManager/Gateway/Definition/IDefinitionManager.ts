import { ListDefinitionResult } from "../../../Result/Gateway/Definition/ListDefinitionResult";
import { CreateDefinitionPayload } from "./Payload/CreateDefinitionPayload";

export abstract class IDefinitionManager {
  abstract createAsync(payload: CreateDefinitionPayload): Promise<void>;

  abstract listAsync(): Promise<ListDefinitionResult[]>;
}
