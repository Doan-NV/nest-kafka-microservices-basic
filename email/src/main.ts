import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          requestTimeout: 10000
        },
        consumer: {
          groupId: "my-kafka-consumer"
        }
      }
    },
  );

  await app.listen();
  console.log("app is listening......");
  
}
bootstrap();
