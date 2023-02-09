import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EMAIL_TOPIC } from 'src/environments';
import { Repository } from 'typeorm';
import { KafkaError } from './kafka.error';

@Injectable()
export class KafkaService {
  constructor(
    @InjectRepository(KafkaError)
    private kafkaErrorRepository: Repository<KafkaError>,
    @Inject('KAFKA_SERVER') private clientKafka: ClientKafka
  ) {}
  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf(EMAIL_TOPIC);
    await this.clientKafka.connect();
  }

  async save(data = {}) {
    try {
      const record = this.kafkaErrorRepository.save(data, { reload: true });
      return record;
    } catch (error) {
      throw error;
    }
  }

  async emit(topics: string[], key: string, value: any) {
    for (const topic of topics) {
      this.clientKafka.emit(topic, {
        key,
        value: JSON.stringify(value),
      });
    }
  }
}
