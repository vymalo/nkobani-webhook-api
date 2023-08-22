import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminClient } from '@s3pweb/keycloak-admin-client-cjs';

@Module({
  providers: [
    {
      provide: KeycloakAdminClient,
      inject: [ConfigService],
      useFactory: async (cs: ConfigService) => {
        const kcAdminClient = new KeycloakAdminClient({
          baseUrl: cs.getOrThrow<string>('KEYCLOAK_URL'),
          realmName: cs.getOrThrow<string>('KEYCLOAK_REALM'),
        });
        await kcAdminClient.auth({
          username: cs.get('KEYCLOAK_ADMIN_USERNAME'),
          password: cs.get('KEYCLOAK_ADMIN_PASSWORD'),
          grantType: 'password',
          clientId: 'admin-cli',
        });
        return kcAdminClient;
      },
    },
  ],
  exports: [KeycloakAdminClient],
})
export class KeycloakModule {}
