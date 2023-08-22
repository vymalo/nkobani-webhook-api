import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventSourceService } from './event-source.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventSourceController } from './event-source.controller';
import {
  NestjsQueryGraphQLModule,
  pubSubToken,
} from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { EventReceivedEntity } from './event-received.entity';
import { EventReceived } from './model/event-received';
import { PubSubModule } from '../pub-sub/pub-sub.module';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'WEBHOOK_SERVICE',
        useFactory: (cs: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [cs.getOrThrow<string>('RABBITMQ_URI')],
            queue: cs.getOrThrow('RABBITMQ_QUEUE_NAME'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        PubSubModule,
        NestjsQueryTypeOrmModule.forFeature([EventReceivedEntity]),
      ],
      pubSub: {
        provide: pubSubToken(),
        useExisting: 'PUB_SUB',
      },
      resolvers: [
        {
          DTOClass: EventReceived,
          EntityClass: EventReceivedEntity,
          delete: { disabled: true },
          update: { disabled: true },
          create: { disabled: true },
          enableTotalCount: true,
          enableAggregate: true,
        },
      ],
    }),
  ],
  providers: [EventSourceService],
  controllers: [EventSourceController],
})
export class EventSourceModule {}
