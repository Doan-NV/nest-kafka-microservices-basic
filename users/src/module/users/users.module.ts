import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserToken } from './entity/user.token.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TokenService } from './userToken.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserToken])],
  controllers: [UsersController],
  providers: [UsersService, TokenService],
  exports: [UsersService, TokenService],
})
export class UsersModule {}
