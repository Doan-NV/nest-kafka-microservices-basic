import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaError } from './kafka.error';

@Injectable()
export class KafkaService {
  constructor(
    @InjectRepository(KafkaError)
    private kafkaErrorRepository: Repository<KafkaError>,
    @Inject('KAFKA_SERVER') private client: ClientKafka,
  ) {}

  async save(data = {}) {
    try {
      const record = this.kafkaErrorRepository.save(data, { reload: true });
      return record;
    } catch (error) {
      throw error;
    }
  }

  async emit(topic: string[], key: string, value: any) {
    for (let i = 0; i < topic.length; i++) {
      console.log(topic);
      await this.client.emit(topic, {
        key,
        value: JSON.stringify(value),
      });
    }
  }
}
