import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/') {
      res.send('ok');
      return;
    }
    next();
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/order');
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
