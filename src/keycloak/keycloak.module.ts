import { Module, OnModuleInit } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';

@Module({
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule implements OnModuleInit {
  constructor(private readonly keycloakService: KeycloakService) {}

  public async onModuleInit(): Promise<void> {
    await this.keycloakService.init();
  }
}
