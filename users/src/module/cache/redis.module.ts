import { Module, DynamicModule } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from 'src/environments';

// import { RedisModuleConstant } from './constants/redis.constant';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({ port: parseInt(REDIS_PORT), host: REDIS_HOST }),
  ],
  exports: [RedisModule.forRoot()],
})
export class RedisModule {
  static forRoot(options?: RedisOptions): DynamicModule {
    const providers = [
      {
        provide: 'REDIS',
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
