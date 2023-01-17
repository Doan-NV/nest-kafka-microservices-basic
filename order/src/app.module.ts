import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from './environments';
import { ProductModule } from './modules/product/product.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { OrderModule } from './modules/order/order.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL_HOST,
      port: Number(MYSQL_PORT),
      username: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // synchronize: true shouldn't be used in production - otherwise you can lose production data.
    }),
    UserModule,
    ProductModule,
    KafkaModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
