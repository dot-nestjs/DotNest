import { AdminController } from "../AdminController";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Test")
@Controller("api/Admin/v1/Test")
export class TestController extends AdminController {
  @Get()
  async detailAsync(): Promise<any> {
    return "Admin Test";
  }
}
