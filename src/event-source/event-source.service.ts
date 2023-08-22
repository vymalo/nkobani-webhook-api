import { Injectable } from '@nestjs/common';
import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { gql, GraphQLClient } from 'graphql-request';

const query = gql`
  mutation ($userId: String!, $userName: String) {
    insert_users(
      objects: [{ id: $userId, name: $userName, last_seen: "now()" }]
      on_conflict: { constraint: users_pkey, update_columns: [last_seen, name] }
    ) {
      affected_rows
    }
  }
`;

@Injectable()
export class EventSourceService {
  constructor(@InjectGraphQLClient() private readonly client: GraphQLClient) {}

  public async publishEvent(data: any) {
    const variables = {
      userId: data.userId,
      userName: data.details?.username ?? '',
    };
    await this.client.request(query, variables);
  }
}
