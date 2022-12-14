import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContractWithBalanceDto {
  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => Float, { nullable: false })
  chainId: number;

  @Field(() => Float, { nullable: false })
  balanceInUsd: number;

  @Field(() => Int, { nullable: false })
  calls: number;
}
