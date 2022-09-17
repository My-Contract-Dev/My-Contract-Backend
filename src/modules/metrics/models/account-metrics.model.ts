import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccountMetrics {
  @Field(() => Int)
  calls: number;
}
