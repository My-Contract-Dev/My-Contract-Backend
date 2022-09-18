import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContractMetricsDto {
  @Field(() => Float, { nullable: false })
  balance: number;

  @Field(() => Int, { nullable: false })
  gasUsed: number;

  @Field(() => Float, { nullable: false })
  averageGasUsed: number;

  @Field(() => Int, { nullable: false })
  users: number;

  @Field(() => Int, { nullable: false })
  calls: number;
}
