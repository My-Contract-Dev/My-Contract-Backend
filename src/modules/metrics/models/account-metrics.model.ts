import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccountMetrics {
  @Field(() => Int, { nullable: false })
  calls: number;

  @Field(() => Int, { nullable: false })
  users: number;

  @Field(() => Float, { nullable: false })
  balanceInUsd: number;
}
