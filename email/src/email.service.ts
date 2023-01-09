import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public sendCompleteOrder(): void {

    this.mailerService.sendMail({
      to: 'yileuu37na@gmail.com', // List of receivers email address
      // from: 'yileuu37na@gmail.com', // Senders email address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>welcome</b>', // HTML body content
    })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
