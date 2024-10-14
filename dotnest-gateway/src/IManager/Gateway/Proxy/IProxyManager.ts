import { RequestPayload } from "./Payload/RequestPayload";

export abstract class IProxyManager {
  abstract executeRequestAsync(payload: RequestPayload): Promise<string>;
  abstract getAsync(payload: RequestPayload): Promise<string>;
}
