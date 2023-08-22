import { IEvent } from '@nestjs/cqrs';

export class ScriptRanEvent implements IEvent {
  constructor(
    public readonly runId: any,
  ) {}
}
