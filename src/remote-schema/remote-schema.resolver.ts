import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user';
import { KeycloakAdminClient } from '@s3pweb/keycloak-admin-client-cjs';

@Resolver(() => User)
export class RemoteSchemaResolver {
  constructor(private readonly kcAdminClient: KeycloakAdminClient) {}

  @Query(() => User)
  async user(@Args('id', { type: () => String }) id: string): Promise<User> {
    const result = await this.kcAdminClient.users.findOne({ id });
    if (!result) throw new Error('User not found');
    return {
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
    };
  }
}
