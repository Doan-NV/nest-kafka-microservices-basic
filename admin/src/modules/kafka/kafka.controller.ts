import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';
import { ADMIN_TOPIC } from 'src/environments';
import { KafkaService } from './kafka.service';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}
  @MessagePattern(ADMIN_TOPIC)
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
