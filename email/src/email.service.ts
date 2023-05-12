import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { KafkaMessage } from 'kafkajs';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  public async sendCompleteOrder(payload: any) {

    const {email, message, } =payload;
    this.mailerService.sendMail({
      to: email, // List of receivers email address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: `${message}`, // plaintext body
    })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
    
    return 'send mail success';
  }
}
