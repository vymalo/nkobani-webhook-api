import { ICommand } from '@nestjs/cqrs';

export class SaveLogCommand implements ICommand {
  constructor(public readonly args: any[]) {}
}
