import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { EMAIL_TOPIC } from 'src/environments';
import { Connection } from 'typeorm';
import { KafkaService } from '../kafka/kafka.service';
import { Product } from '../product/entity/product.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Order } from './entity/order';
import { OrderItem } from './entity/order.item';
import { CreateOrderDto } from './order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly kafkaService: KafkaService,
    private connection: Connection,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  // @Post('confirm')
  // async confirm(@Body('source') source: string) {
  //   const order = await this.orderService.findOne({
  //     where: { transaction_id: source },
  //     relations: ['user', 'orderItems'],
  //   });

  //   if (!order) {
  //     throw new NotFoundException('Order not found');
  //   }

  //   await this.orderService.update(order.id.toString(), { complete: true });

  //   await this.kafkaService.emit(
  //     ['admin-topic', 'email-topic'],
  //     'orderCompleted',
  //     {
  //       ...order,
  //       total: order.total,
  //     },
  //   );

  //   return {
  //     message: 'success',
  //   };
  // }

  @Post()
  async create(@Body() body: CreateOrderDto, @Req() request: Request) {
    const user = await this.userService.get(request.cookies.key);
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const o = new Order();
      o.userId = 'link.user_id';
      // o.firstName = body.firstName;
      // o.lastName = body.lastName;
      o.email = body.email;
      o.address = body.address;
      o.country = body.country;
      // o.city = body.city;
      // o.zip = body.zip;
      // o.code = body.code;

      const order = await queryRunner.manager.save(o);

      const lineItems = [];

      // for (const p of body.products) {
      //   const product: Product = await this.productService.findOne({
      //     id: p.product_id,
      //   });

      //   const orderItem = new OrderItem();
      //   orderItem.order = order;
      //   orderItem.productTitle = product.title;
      //   orderItem.price = product.price;
      //   orderItem.quantity = p.quantity;
      //   orderItem.adminRevenue = 0.9 * product.price * p.quantity;

      //   await queryRunner.manager.save(orderItem);

      //   lineItems.push({
      //     name: product.title,
      //     description: product.description,
      //     images: [product.image],
      //     amount: 100 * product.price,
      //     currency: 'usd',
      //     quantity: p.quantity,
      //   });
      // }

      // const source = await this.stripeClient.checkout.sessions.create({
      //   payment_method_types: ['card'],
      //   line_items,
      //   success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
      //   cancel_url: `${process.env.CHECKOUT_URL}/error`,
      // });

      order.transactionId = 'source["id"]';
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return 'source';
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  @Get()
  async listProduct(@Param() params) {
    return this.productService.find();
  }
}
