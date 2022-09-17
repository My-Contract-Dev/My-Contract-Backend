import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IAddress } from '../interfaces';

@ObjectType()
export class AddressDto implements IAddress {
  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => Int, { nullable: false })
  chainId: number;
}
