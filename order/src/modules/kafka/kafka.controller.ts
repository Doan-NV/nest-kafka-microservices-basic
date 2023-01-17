import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';
import { ProductService } from '../product/product.service';
import { KafkaService } from './kafka.service';

@Controller()
export class KafkaController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly productService: ProductService,
  ) {}
  @MessagePattern('order-topic')
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

  async productCreated(data: any) {
    await this.productService.save(data);
  }

  async productUpdated(data: any) {
    await this.productService.update(data.id, data);
  }

  async productDeleted(data: any) {
    await this.productService.delete(data);
  }
}
