import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { SMTP_SERVER, EMAIL_DEFAULT, SMTP_USER, SMTP_PASSWORD, SMTP_PORT } from './config';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: SMTP_SERVER,
        port: Number(SMTP_PORT),
        ignoreTLS: false,
        requireTLS: true,
        tls: {
          ciphers: 'SSLv3',
        },
        secure: false, // use SSL
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      },
      defaults: {
        from: EMAIL_DEFAULT
      }
    })
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule { }
