import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IAsset } from '../interfaces';

@ObjectType()
export class AssetDto implements IAsset {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  balance: string;

  @Field(() => Float, { nullable: false })
  price: number;

  @Field(() => Float, { nullable: false })
  inUsd: number;

  @Field(() => Int, { nullable: false })
  decimals: number;

  @Field(() => String, { nullable: false })
  type: string;

  @Field(() => String, { nullable: true })
  icon?: string;

  @Field(() => String, { nullable: true })
  symbol?: string;
}
