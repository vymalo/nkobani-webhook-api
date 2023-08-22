import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { EventSourceService } from './event-source.service';

@Controller()
export class EventSourceController {
  constructor(private readonly eventSourceService: EventSourceService) {}

  @MessagePattern()
  async listenToAll(@Payload() data: any, @Ctx() context: RmqContext) {
    const {
      fields: { routingKey, exchange },
      properties: { appId, headers },
    } = context.getMessage();
    await this.eventSourceService.publishEvent(data, appId, {
      headers,
      routingKey,
      exchange,
    });
  }
}
