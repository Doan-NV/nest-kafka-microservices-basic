import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';
import { KafkaService } from './kafka.service';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}
  @MessagePattern('admin-topic')
  async event(@Payload() message: KafkaMessage) {
    try {
      await this[message.key.toString()](message.value);
    } catch (error) {
      await this.kafkaService.save({
        key: message.key.toString(),
        value: message.value,
        error: error.message,
      });
    }
  }
}
