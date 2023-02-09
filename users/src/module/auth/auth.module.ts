import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
// import { RedisModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, KafkaModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
