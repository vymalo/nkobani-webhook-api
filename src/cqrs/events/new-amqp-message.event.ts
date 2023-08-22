import { IEvent } from '@nestjs/cqrs';
import { EventReceivedEntity } from '../../event-source/event-received.entity';

export class NewAmqpMessageEvent implements IEvent {
  constructor(
    public readonly event: EventReceivedEntity,
    public readonly data: any,
    public readonly appId?: any,
    public readonly params?: Record<string, any>,
  ) {}
}
