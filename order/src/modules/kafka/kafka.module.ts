import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SERVER } from 'src/environments';
import { ProductModule } from '../product/product.module';
import { KafkaController } from './kafka.controller';
import { KafkaError } from './kafka.error';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KafkaError]),
    ClientsModule.register([
      {
        name: SERVER,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            requestTimeout: 10000,
            clientId: 'kafka-local',
          },
          consumer: {
            groupId: 'my-kafka-consumer',
          },
        },
      },
    ]),
    ProductModule,
  ],
  controllers: [KafkaController],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
