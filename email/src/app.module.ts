import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 9092
      },
      defaults: {
        from: 'no-reply@localhost.com'
      }
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
