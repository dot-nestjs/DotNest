import { ModuleMetadata } from '@nestjs/common';
import { Manager } from './Manager';
import { Controller } from './Controller';
import { Plugin } from './Plugin';

export class DependencyContainer {
  controllers: Controller[];
  managers: Manager[];
  plugins: Plugin[];
  modules: NonNullable<ModuleMetadata['imports']>;
  exports: NonNullable<ModuleMetadata['exports']>;

  constructor() {
    this.controllers = [];
    this.managers = [];
    this.modules = [];
    this.exports = [];
    this.plugins = [];
  }
}
