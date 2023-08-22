import { ICommand } from '@nestjs/cqrs';
import { EventHandlerEntity } from '../../event-handler/event-handler.entity';

export class RunScriptWebhookCommand implements ICommand {
  constructor(
    public readonly handler: EventHandlerEntity,
    public readonly data: any,
    public readonly appId?: any,
    public readonly params?: Record<string, any>,
  ) {}
}
