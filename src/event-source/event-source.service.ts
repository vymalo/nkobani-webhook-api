import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { NewAmqpMessageEvent } from '../cqrs/events/new-amqp-message.event';
import { EventReceivedEntity } from './event-received.entity';
import { InjectQueryService, QueryService } from '@nestjs-query/core';

@Injectable()
export class EventSourceService {
  constructor(
    private readonly eventBus: EventBus,
    @InjectQueryService(EventReceivedEntity)
    private readonly service: QueryService<EventReceivedEntity>,
  ) {}

  public async publishEvent(
    data: any,
    appId: any,
    params: { headers: any; exchange: any; routingKey: any },
  ) {
    const event = new EventReceivedEntity();
    event.eventTypes = [params.exchange, data?.type, params.routingKey].filter(
      (value) => !!value,
    );
    event.protocol = 'amqp';
    event.routingKey = params.routingKey;
    event.exchange = params.exchange;
    const saved = await this.service.createOne(event);
    this.eventBus.publish(new NewAmqpMessageEvent(saved, data, appId, params));
  }
}
