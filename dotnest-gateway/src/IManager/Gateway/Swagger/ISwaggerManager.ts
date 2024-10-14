import { SwaggerDetailPayload } from "./Payload/SwaggerDetailPayload";

export abstract class ISwaggerManager {
  abstract detailAsync(payload: SwaggerDetailPayload): Promise<string>;
}
