import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { EMAIL_TOPIC } from './config';
@Controller()
export class EmailController {
  constructor(
    private readonly emailService: EmailService
  ) { }

  @MessagePattern(EMAIL_TOPIC)
  async orderCompile(@Payload() payload: any) {

    this.emailService.sendCompleteOrder(payload);
  }
}
