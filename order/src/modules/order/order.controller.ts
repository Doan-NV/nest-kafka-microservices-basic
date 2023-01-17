import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
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

  @Post('confirm')
  async confirm(@Body('source') source: string) {
    const order = await this.orderService.findOne({
      where: { transaction_id: source },
      relations: ['user', 'order_items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderService.update(order.id.toString(), { complete: true });

    await this.kafkaService.emit(
      ['admin_topic', 'email_topic'],
      'orderCompleted',
      {
        ...order,
        total: order.total,
      },
    );

    return {
      message: 'success',
    };
  }

  @Post()
  async create(@Body() body: CreateOrderDto) {
    // const link: Link = await this.linkService.findOne({
    //   code: body.code,
    //   relations: ["user"]
    // });

    // if (!link) {
    //   throw new BadRequestException("Invalid link!");
    // }

    const user = await this.userService.get(`users/$link.user_id}`);

    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const o = new Order();
      o.userId = 'link.user_id';
      o.firstName = body.first_name;
      o.lastName = body.last_name;
      o.email = body.email;
      o.address = body.address;
      o.country = body.country;
      o.city = body.city;
      o.zip = body.zip;
      o.code = body.code;

      const order = await queryRunner.manager.save(o);

      const lineItems = [];

      for (const p of body.products) {
        const product: Product = await this.productService.findOne({
          id: p.product_id,
        });

        const orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.productTitle = product.title;
        orderItem.price = product.price;
        orderItem.quantity = p.quantity;
        orderItem.adminRevenue = 0.9 * product.price * p.quantity;

        await queryRunner.manager.save(orderItem);

        lineItems.push({
          name: product.title,
          description: product.description,
          images: [product.image],
          amount: 100 * product.price,
          currency: 'usd',
          quantity: p.quantity,
        });
      }

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
}
