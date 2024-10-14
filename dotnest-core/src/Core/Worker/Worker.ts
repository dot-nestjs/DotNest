import { NestFactory } from '@nestjs/core';
import { Logger } from '../../Logger';
import { Core } from '../Core';
import { WorkerPayload } from './Payload/WorkerPayload';
import * as fs from 'fs';
import * as path from 'path';
import { publicEncrypt } from 'crypto';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';
import { ReplyPayload } from './Payload/ReplyPayload';
import { EventTrigger } from '../../index';

function reply(payload: ReplyPayload) {
  const encryptedMessage = publicEncrypt(
    {
      key: payload.publicKey,
      padding: RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(payload.message),
  ).toString('base64');
  process.send?.(encryptedMessage);
}

process.on('message', async (payload: WorkerPayload) => {
  //console.log('payload', payload);
  const logger = new Logger(Core.prefix(payload.name));
  const module = await Core.createRuntimeModuleAsync(payload.container);
  const app = await NestFactory.create(module, {
    logger: logger,
  });

  const socksPath = path.join(process.cwd(), 'dist', 'socks');
  if (!fs.existsSync(socksPath)) {
    await fs.promises.mkdir(socksPath);
  }

  const socketPath = path.join(socksPath, `${payload.name}.sock`);
  if (fs.existsSync(socketPath)) {
    await fs.promises.rm(socketPath, { force: true });
  }
  await EventTrigger.executeAllWebApplicationPreStartupAsync({
    plugins: payload.container.plugins.map((plugin) => plugin.pluginClass),
    event: async () => {
      return {
        webApplication: app,
        context: payload.context,
        container: payload.container,
      };
    },
  });
  await app.listen(socketPath);
  reply({ publicKey: payload.publicKey, message: payload.nonce });
  await EventTrigger.executeAllWebApplicationPostStartupAsync({
    plugins: payload.container.plugins.map((plugin) => plugin.pluginClass),
    event: async () => {
      return {
        context: payload.context,
        webApplication: app,
        container: payload.container,
      };
    },
  });
});
