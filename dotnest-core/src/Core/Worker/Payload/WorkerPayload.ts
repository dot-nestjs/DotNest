import { DependencyContainer } from '../../../index';

export interface WorkerPayload {
  name: string;
  context: string[];
  container: DependencyContainer;
  nonce: string;
  publicKey: string | Buffer;
}
