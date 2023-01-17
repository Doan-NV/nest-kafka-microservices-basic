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
// import { Link } from '../link/link';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true })
  transactionId: string;

  @Column()
  userId: number;

  @Column()
  code: string;

  @Exclude()
  @Column()
  firsName: string;

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  // @ManyToOne(() => Link, (link) => link.orders, {
  //   createForeignKeyConstraints: false,
  // })
  // @JoinColumn({
  //   referencedColumnName: 'code',
  //   name: 'code',
  // })
  // link: Link;
}
