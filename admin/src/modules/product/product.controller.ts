import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { KafkaService } from '../kafka/kafka.service';
import { ORDER_TOPIC } from 'src/environments';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private kafkaService: KafkaService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async all() {
    return this.productService.find();
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: ProductCreateDto) {
    const product = await this.productService.save(body);
    await this.kafkaService.emit([ORDER_TOPIC], 'productCreated', product);
    return product;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    const product = await this.productService.findOne({ id });
    return product;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: ProductCreateDto) {
    await this.productService.update(id, body);
    const product = await this.productService.findOne({ id });

    await this.kafkaService.emit([ORDER_TOPIC], 'productUpdated', product);

    return product;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const response = await this.productService.delete(id);

    await this.kafkaService.emit([ORDER_TOPIC], 'productDeleted', id);

    return response;
  }
}
