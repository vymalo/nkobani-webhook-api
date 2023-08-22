import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { EventLogModule } from './event-log/event-log.module';
import { EventHandlerModule } from './event-handler/event-handler.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { EventSourceModule } from './event-source/event-source.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SagaService } from './cqrs/saga.service';
import { RunScriptModule } from './run-script/run-script.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import * as Keyv from 'keyv';
import * as Joi from 'joi';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required().uri({ scheme: 'postgres' }),
        REDIS_URL: Joi.string().required().uri({ scheme: 'redis' }),
        RABBITMQ_URI: Joi.string()
          .required()
          .uri({ scheme: ['amqp', 'amqps'] }),
        RABBITMQ_QUEUE_NAME: Joi.string()
          .default('webhook_queue')
          .pattern(/([a-zA-Z0-9_]+)/),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    PubSubModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (cs: ConfigService) => ({
        type: 'postgres',
        url: cs.getOrThrow('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        logging: cs.get('NODE_ENV') !== 'production',
        cache: {
          type: 'ioredis',
          options: cs.getOrThrow('REDIS_URL'),
          alwaysEnabled: true,
          duration: 60_000 * 60 * 24 * 7, // 7 days
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (cs: ConfigService) => ({
        subscriptions: {
          'graphql-ws': true,
        },
        autoSchemaFile: true,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        csrfPrevention: true,
        cache: new KeyvAdapter(
          new Keyv(cs.getOrThrow('REDIS_URL'), {
            namespace: 'apollo',
            adapter: 'redis',
          }),
        ),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    EventLogModule,
    EventHandlerModule,
    EventSourceModule,
    RunScriptModule,
  ],
  providers: [SagaService],
})
export class AppModule {}
