import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContractWithBalanceDto {
  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => Float, { nullable: false })
  chainId: number;

  @Field(() => String, { nullable: false })
  balanceInUsd: number;
}
