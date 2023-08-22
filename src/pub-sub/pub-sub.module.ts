import { Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';

const provider: Provider = {
  provide: 'PUB_SUB',
  useFactory: (cs: ConfigService) => {
    return new RedisPubSub({
      publisher: new Redis(cs.getOrThrow('REDIS_URL')),
      subscriber: new Redis(cs.getOrThrow('REDIS_URL')),
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [provider],
  exports: [provider],
})
export class PubSubModule {}
