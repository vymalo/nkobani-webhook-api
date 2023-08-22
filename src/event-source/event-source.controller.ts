import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventSourceService } from './event-source.service';

@Controller()
export class EventSourceController {
  private readonly logger = new Logger(EventSourceController.name);

  constructor(private readonly eventSourceService: EventSourceService) {}

  @MessagePattern()
  async listenToAll(@Payload() data: any) {
    if (data.clientId === 'admin-cli') {
      return;
    }

    switch (data.type) {
      case 'LOGIN':
      case 'LOGOUT':
      case 'REGISTER':
      case 'UPDATE_PROFILE':
      case 'UPDATE_EMAIL':
      case 'USER-UPDATE':
        await this.eventSourceService.publishEvent(data);
        break;
      default:
        this.logger.debug(
          `KC Event ${data.type} userId(${data.userId}) not handled`,
        );
    }
  }
}
