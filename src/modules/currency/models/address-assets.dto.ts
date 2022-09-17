import { Field, ObjectType } from '@nestjs/graphql';
import { IAddressAssets } from '../interfaces';
import { AssetDto } from './asset.dto';

@ObjectType()
export class AddressAssetsDto implements IAddressAssets {
  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => [AssetDto], { nullable: false })
  assets: AssetDto[];
}
