import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order';

@Entity('order_items')
export class OrderItem {
  @PrimaryColumn()
  id: number;

  @Column()
  productTitle: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  adminRevenue: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
