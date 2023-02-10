import ms from 'ms';
import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
@Injectable()
export class RedisService {
  redisClient: Redis;
  constructor(config?: RedisOptions) {
    this.redisClient = new Redis(config);
  }

  async initConnection() {
    try {
      await this.redisClient.connect();
    } catch (error) {
      throw error;
    }
  }

  async addByKey(key: string | Buffer, value: string | Buffer, time: string) {
    return this.redisClient.set(key, value, 'PX', ms(time));
  }

  async getByKey(key: string | Buffer) {
    return this.redisClient.get(key);
  }

  async removeByKey(key: string | Buffer) {
    return this.redisClient.del(key);
  }

  async getClient() {
    return this.redisClient;
  }
}
