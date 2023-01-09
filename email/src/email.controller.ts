import { MailerService } from '@nest-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';
import { EmailService } from './email.service';
import { EMAIL_TOPIC } from './config';


@Controller()
export class EmailController {
  constructor(
    private readonly emailService: EmailService
  ) { }

  @MessagePattern(EMAIL_TOPIC) // email-topic: name of kafka topic
  async orderCompile(@Payload() message: KafkaMessage) {
    // console.log(EMAIL_TOPIC);
    console.log("🚀 ~ file: app.controller.ts ~ line 15 ~ EmailController ~ orderCompile ~ message", message);
    // await this.mailerService.sendMail({
    //   to: 'admin@admin.com',
    //   subject: 'An order has been completed',
    //   html: `Order #${order.id} with a total of $${order.total} has been completed!`
    // })

    // await this.mailerService.sendMail({
    //   to: order.ambassador_email,
    //   subject: 'An order has been completed',
    //   html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
    // })
    this.emailService.sendCompleteOrder();
  }
}
