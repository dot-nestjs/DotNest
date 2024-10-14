import {
  BasePlugin,
  IWebApplicationPreStartupEventListener,
  WebApplicationPreStartupEvent,
} from "@dotnest/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class Plugin
  extends BasePlugin
  implements IWebApplicationPreStartupEventListener
{
  async executeWebApplicationPreStartupAsync(
    event: WebApplicationPreStartupEvent
  ): Promise<void> {
    const config = new DocumentBuilder()
      .setTitle("Backend API")
      .setDescription("Backend description")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(event.webApplication, config);
    SwaggerModule.setup("swagger", event.webApplication, document);
  }

  name(): string {
    return "Swagger";
  }
}
