import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MobileController } from "../MobileController";

@ApiTags("Test")
@Controller("api/Mobile/v1/Test")
export class TestController extends MobileController {
  @Get()
  async detailAsync(): Promise<any> {
    return "Mobile Test";
  }
}
