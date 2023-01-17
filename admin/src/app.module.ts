import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './modules/auth/auth.controller';
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from './environments';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';

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
  ],
  controllers: [UserController, AuthController],
  providers: [],
})
export class AppModule {}
