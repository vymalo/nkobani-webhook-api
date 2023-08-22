import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventSourceService } from './event-source.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventSourceController } from './event-source.controller';
import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request';

@Module({
  imports: [
    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      // Exposes configuration options based on the graphql-request package
      useFactory: (cs: ConfigService) => ({
        endpoint: cs.getOrThrow('HASURA_GRAPHQL_ENDPOINT'),
        options: {
          headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': cs.getOrThrow(
              'HASURA_GRAPHQL_ADMIN_SECRET',
            ),
          },
        },
      }),
      inject: [ConfigService],
    }),
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
  ],
  providers: [EventSourceService],
  controllers: [EventSourceController],
})
export class EventSourceModule {}
