import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventSourceService } from './event-source.service';
import { ConfigService } from '@nestjs/config';
import { KeycloakService } from '../keycloak/keycloak.service';

@Controller()
export class EventSourceController {
  private readonly logger = new Logger(EventSourceController.name);

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly eventSourceService: EventSourceService,
    private readonly cs: ConfigService,
  ) {}

  @MessagePattern()
  async listenToAll(@Payload() data: any) {
    if (data.clientId === this.cs.get('KEYCLOAK_CLIENT_ID')) {
      return;
    }

    if (data.realmId !== this.keycloakService.realmId) {
      return;
    }

    switch (data.type) {
      case 'LOGIN':
      case 'LOGOUT':
      case 'REGISTER':
      case 'UPDATE_PROFILE':
      case 'UPDATE_EMAIL':
        await this.eventSourceService.publishEvent(data);
        break;
      default:
        this.logger.debug(
          `KC Event ${data.type} userId(${data.userId}) not handled`,
        );
    }
  }
}
