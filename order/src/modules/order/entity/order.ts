import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order.item';
import { Exclude, Expose } from 'class-transformer';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column()
  userId: string;

  @Column()
  code: string;

  @Exclude()
  @Column()
  firstName: string;

  @Exclude()
  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zip: string;

  @Exclude()
  @Column({ default: false })
  complete: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @Expose()
  get total(): number {
    return this.orderItems.reduce((s, i) => s + i.adminRevenue, 0);
  }

  @Expose()
  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
