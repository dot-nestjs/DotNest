import { INestApplication } from '@nestjs/common';
import { BaseEvent } from '../../BaseEvent';

export class WebApplicationPostStartupEvent extends BaseEvent {
  webApplication: INestApplication;

  constructor(context: string[], webApplication: INestApplication) {
    super(context);
    this.webApplication = webApplication;
  }
}
