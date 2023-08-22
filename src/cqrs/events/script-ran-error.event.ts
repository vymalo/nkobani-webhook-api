import { IEvent } from '@nestjs/cqrs';

export class ScriptRanErrorEvent implements IEvent {
  constructor(
    public readonly runId: any,
  ) {}
}
