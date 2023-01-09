import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { EmailModule } from './email.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          requestTimeout: 10000,
          clientId: "kafka-local"
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
