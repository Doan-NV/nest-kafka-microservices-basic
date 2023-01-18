import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  async save(data = {}) {
    try {
      const newProduct = this.productRepository.save(data, { reload: true });
      return newProduct;
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

  async update(id: string, data = {}) {
    try {
      return this.productRepository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
