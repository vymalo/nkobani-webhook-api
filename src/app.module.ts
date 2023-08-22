import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { EventSourceModule } from './event-source/event-source.module';
import { RemoteSchemaModule } from './remote-schema/remote-schema.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import * as Keyv from 'keyv';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        REDIS_URL: Joi.string().required().uri({ scheme: 'redis' }),
        RABBITMQ_URI: Joi.string()
          .required()
          .uri({ scheme: ['amqp', 'amqps'] }),
        RABBITMQ_QUEUE_NAME: Joi.string()
          .default('webhook_queue')
          .pattern(/([a-zA-Z0-9_]+)/),
        HASURA_GRAPHQL_ENDPOINT: Joi.string()
          .uri()
          .default('http://localhost:8080/v1/graphql'),
        HASURA_GRAPHQL_ADMIN_SECRET: Joi.string(),
        KEYCLOAK_URL: Joi.string().uri().required(),
        KEYCLOAK_REALM: Joi.string()
          .pattern(/([a-zA-Z0-9_]+)/)
          .required(),
        KEYCLOAK_CLIENT_ID: Joi.string().required(),
        KEYCLOAK_CLIENT_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (cs: ConfigService) => ({
        autoSchemaFile: true,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        introspection: true,
        csrfPrevention: false,
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
    EventSourceModule,
    RemoteSchemaModule,
    KeycloakModule,
  ],
})
export class AppModule {}
