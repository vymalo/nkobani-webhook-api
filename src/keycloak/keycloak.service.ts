import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminClient } from '@s3pweb/keycloak-admin-client-cjs';

@Injectable()
export class KeycloakService {
  private readonly kcAdminClient: KeycloakAdminClient;

  private realm: any;

  public constructor(private readonly cs: ConfigService) {
    this.kcAdminClient = new KeycloakAdminClient({
      baseUrl: cs.getOrThrow<string>('KEYCLOAK_URL'),
      realmName: cs.getOrThrow<string>('KEYCLOAK_REALM'),
    });
  }

  public get realmId(): string {
    return this.realm.id;
  }

  public async init() {
    await this.auth();

    this.realm = await this.kcAdminClient.realms.findOne({
      realm: this.cs.get('KEYCLOAK_REALM'),
    });
  }

  public async getUser(id: string): Promise<any> {
    await this.auth();
    return this.kcAdminClient.users.findOne({ id });
  }

  private async auth() {
    await this.kcAdminClient.auth({
      clientId: this.cs.getOrThrow('KEYCLOAK_CLIENT_ID'),
      clientSecret: this.cs.getOrThrow('KEYCLOAK_CLIENT_SECRET'),
      grantType: 'client_credentials',
    });
  }
}
