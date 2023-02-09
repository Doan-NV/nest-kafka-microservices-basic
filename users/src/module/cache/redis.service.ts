import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  redisClient;
  constructor(config?: Redis.RedisOptions) {
    this.redisClient = Redis;
  }

  async initConnection() {
    try {
      await this.redisClient.connect();
    } catch (error) {
      throw error;
    }
  }

  async addByKey(key, value, time) {
    return this.redisClient.set(key, value, 'PX', time);
  }

  async getByKey(key) {
    return this.redisClient.get(key);
  }

  async removeByKey(key) {
    return this.redisClient.del(key);
  }

  async getClient() {
    return this.redisClient;
  }
}
