import { Module } from '@nestjs/common';
import { RemoteSchemaResolver } from './remote-schema.resolver';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
  providers: [RemoteSchemaResolver],
  imports: [KeycloakModule],
})
export class RemoteSchemaModule {}
