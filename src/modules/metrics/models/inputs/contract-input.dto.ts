import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ContractInputDto {
  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => Int, { nullable: false })
  chainId: number;
}
