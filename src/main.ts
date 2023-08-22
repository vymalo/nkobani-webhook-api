import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap(port = process.env.PORT ?? '3000') {
  const app = await NestFactory.create(AppModule);

  const cs = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [cs.getOrThrow<string>('RABBITMQ_URI')],
      queue: cs.getOrThrow('RABBITMQ_QUEUE_NAME'),
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`, `sandbox.embed.apollographql.com`],
          styleSrc: [`'self'`, `'unsafe-inline'`, `fonts.googleapis.com`],
          imgSrc: [
            `'self'`,
            'data:',
            'validator.swagger.io',
            `apollo-server-landing-page.cdn.apollographql.com`,
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  await app.listen(port);

  Logger.log(`Listening at http://localhost:${port}/graphql`, 'Bootstrap');
}

bootstrap();
