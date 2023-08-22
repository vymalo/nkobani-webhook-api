import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user';
import { KeycloakService } from '../keycloak/keycloak.service';

@Resolver(() => User)
export class RemoteSchemaResolver {
  constructor(private readonly service: KeycloakService) {}

  @Query(() => User)
  async user(@Args('id', { type: () => String }) id: string): Promise<User> {
    const result = await this.service.getUser(id);
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
