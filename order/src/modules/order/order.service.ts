import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}
  async find(filter = {}) {
    return await this.orderRepository.find(filter);
  }
  async findOne(filter = {}) {
    return await this.orderRepository.findOne(filter);
  }

  async update(id: string, data: any) {
    await this.orderRepository.update(id, data);
  }
}
