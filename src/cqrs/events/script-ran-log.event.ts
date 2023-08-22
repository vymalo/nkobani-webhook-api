import { IEvent } from '@nestjs/cqrs';

export class ScriptRanLogEvent implements IEvent {
  constructor(
    public readonly runId: string,
    public readonly time: number,
    public readonly args: any[],
  ) {}
}
