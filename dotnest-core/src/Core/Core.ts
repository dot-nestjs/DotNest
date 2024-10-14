import { INestApplication, Module, ModuleMetadata } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from '../Logger';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { StartPayload } from './Payload/StartPayload';
import * as fs from 'fs';
import * as path from 'path';
import { ChildProcess, fork } from 'child_process';
import { WorkerPayload } from './Worker/Payload/WorkerPayload';
import { DependencyContainer, EventTrigger } from '../index';
import { generateKeyPairSync, privateDecrypt, randomBytes } from 'crypto';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';

export class Core {
  public static activeAsync(path: string): Promise<any> {
    return new Promise(async (success: any, fail: any) => {
      const module = await require(path);
      const moduleKeys = Object.keys(module);
      if (moduleKeys.length == 1) {
        const moduleInstance = module[moduleKeys[0]];
        success(moduleInstance);
      } else {
        fail('invalid module');
      }
    });
  }

  private static generateNonce(): string {
    return randomBytes(16).toString('hex'); // Generate a random 16-byte nonce
  }

  public static async createRuntimeModuleAsync(container: DependencyContainer) {
    class RootModule {}
    const metadata: ModuleMetadata = {
      controllers: [],
      providers: [],
    };
    for (const controller of container.controllers) {
      const type = await this.activeAsync(controller.controllerClass);
      if (metadata.controllers != undefined) {
        metadata.controllers.push(type);
      }
    }
    for (const manager of container.managers) {
      const interfaceType = await this.activeAsync(manager.interafaceClass);
      const managerType = await this.activeAsync(manager.managerClass);
      if (metadata.providers != undefined) {
        metadata.providers.push({
          provide: interfaceType,
          useClass: managerType,
        });
      }
    }
    Module(metadata)(RootModule);
    return RootModule;
  }

  public static prefix(module: string): string {
    return `${clc.green('[')}${clc.red('Dot')}${clc.green(
      `Nest - ${module}]`,
    )}\t`;
  }

  public static async Start(
    payload: StartPayload,
  ): Promise<INestApplication | null> {
    try {
      if (payload.useSocket) {
        await this.startDefinitionAsync(payload);
        return null;
      } else {
        const module = await this.createRuntimeModuleAsync(payload.container);
        const logger = new Logger(this.prefix(payload.name));
        const app = await NestFactory.create(module, {
          logger: logger,
        });
        await EventTrigger.executeAllWebApplicationPreStartupAsync({
          plugins: payload.container.plugins.map(
            (plugin) => plugin.pluginClass,
          ),
          eventListener: payload.eventListener,
          event: async () => {
            return {
              context: payload.context,
              webApplication: app,
            };
          },
        });
        await app.listen(3000, 'localhost');
        logger.log(`Listening : ${clc.yellow(await app.getUrl())}`);
        await EventTrigger.executeAllWebApplicationPostStartupAsync({
          plugins: payload.container.plugins.map(
            (plugin) => plugin.pluginClass,
          ),
          eventListener: payload.eventListener,
          event: async () => {
            return {
              context: payload.context,
              webApplication: app,
            };
          },
        });
        return app;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  private static startDefinitionAsync(
    payload: StartPayload,
  ): Promise<ChildProcess> {
    return new Promise((success: any, fail: any) => {
      const workerPath = path.join(__dirname, 'Worker', 'Worker.js');
      if (fs.existsSync(workerPath)) {
        const process: ChildProcess = fork(workerPath);
        const nonce = Core.generateNonce();
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
          modulusLength: 2048, // Key size in bits
        });
        const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' });
        process.send({
          container: payload.container,
          name: payload.name,
          context: payload.context,
          nonce: nonce,
          publicKey: publicKeyPem,
        } satisfies WorkerPayload);
        process.on('exit', (code) => {
          new Logger(Core.prefix(payload.name)).fatal(
            'An unexpected exit has been detected. The service will now resume.',
          );
          this.startDefinitionAsync(payload);
        });
        process.on('error', (err) => {
          console.error(`Error in App :`, err);
        });
        process.on('message', (message: string) => {
          const checksum = privateDecrypt(
            {
              key: privateKey,
              padding: RSA_PKCS1_OAEP_PADDING,
            },
            Buffer.from(message, 'base64'),
          ).toString('utf8');
          if (checksum == nonce) {
            success(process);
          } else {
            process.kill();
            fail('Worker checksum failed');
          }
        });
      } else {
        fail('Worker not found');
      }
    });
  }
}
