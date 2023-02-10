import { Module } from '@nestjs/common';
import { RedisModule } from '../cache/redis.module';
import { KafkaModule } from '../kafka/kafka.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, KafkaModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
