import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Order } from './entity/order';
import { OrderItem } from './entity/order.item';
import { OrderController } from './order.controller';
import { OrderItemService } from './order.item.service';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    // LinkModule,
    forwardRef(() => ProductModule),
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService],
  exports: [OrderService],
})
export class OrderModule {}
