import { Module, DynamicModule } from '@nestjs/common';
import * as Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from 'src/environments';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      port: parseInt(REDIS_PORT),
      host: REDIS_HOST,
    }),
  ],
  exports: [RedisModule.forRoot()],
})
export class RedisModule {
  static forRoot(options?: Redis.RedisOptions): DynamicModule {
    const providers = [
      {
        provide: Symbol('REDIS'),
        useFactory: () => new RedisService(options),
      },
    ];

    return {
      providers: providers,
      exports: providers,
      module: RedisModule,
    };
  }
}
