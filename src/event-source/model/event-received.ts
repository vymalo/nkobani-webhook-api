import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { FilterableField, IDField } from '@nestjs-query/query-graphql';

@ObjectType()
export class EventReceived {
  @IDField(() => ID)
  id!: number;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => [String], {
    description: 'Event types',
  })
  eventTypes!: string[];

  @FilterableField({ nullable: true })
  routingKey!: string;

  @FilterableField({ nullable: true })
  exchange!: string;

  @FilterableField()
  protocol: 'http' | 'amqp';
}
