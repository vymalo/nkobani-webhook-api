import { Injectable, Logger } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable, tap } from 'rxjs';
import { NewAmqpMessageEvent } from './events/new-amqp-message.event';
import { SendWebhookCommand } from './commands/send-webhook.command';
import { ScriptRanLogEvent } from './events/script-ran-log.event';
import { SaveLogCommand } from './commands/save-log.command';
import { ScriptReadyEvent } from './events/script-ready.event';
import { RunScriptWebhookCommand } from './commands/run-script-webhook.command';

@Injectable()
export class SagaService {
  private log = new Logger(SagaService.name);

  @Saga()
  eventEmitted = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(NewAmqpMessageEvent),
      tap((event) =>
        this.log.debug(
          `New event emitted from exchange [${event.params.exchange}] with routing key [${event.params.routingKey}]`,
        ),
      ),
      map(
        (event) =>
          new SendWebhookCommand(
            event.event,
            event.data,
            event.appId,
            event.params,
          ),
      ),
    );
  };

  @Saga()
  eventLogEmitted = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ScriptRanLogEvent),
      tap((event) => this.log.debug(event.args[0], ...event.args)),
      map((event) => new SaveLogCommand(event.args)),
    );
  };

  @Saga()
  scriptReady = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ScriptReadyEvent),
      tap((event) => this.log.debug(`Ready to run script ${event.handler.id}`)),
      map(
        (event) =>
          new RunScriptWebhookCommand(
            event.handler,
            event.data,
            event.appId,
            event.params,
          ),
      ),
    );
  };
}
