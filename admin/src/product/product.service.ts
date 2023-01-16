import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ProductCreateDto } from './dto/product.dto';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async find() {
    return await this.productRepository.find();
  }

  async save(data: ProductCreateDto) {
    try {
      this.productRepository.save(data, { reload: true });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: FindOptionsWhere<Product> | FindOptionsWhere<Product>[]) {
    try {
      return this.productRepository.findOneBy(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      return this.productRepository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
