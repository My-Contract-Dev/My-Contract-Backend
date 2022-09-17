import { Args, Field, InputType, Int, Query, Resolver } from '@nestjs/graphql';
import { CurrencyService } from '../currency.service';
import { IAddress, IAddressAssets } from '../interfaces';
import { AddressAssetsDto } from '../models';

@InputType()
class AddressInputType implements IAddress {
  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => Int, { nullable: false })
  chainId: number;
}

@Resolver(() => AddressAssetsDto)
export class CurrencyResolver {
  constructor(private currencyService: CurrencyService) {}

  @Query(() => AddressAssetsDto)
  async addressAssets(
    @Args('address', { type: () => AddressInputType, nullable: false })
    address: AddressInputType,
  ): Promise<IAddressAssets> {
    return this.currencyService.addressAssets(address);
  }

  @Query(() => [AddressAssetsDto])
  async multyAddressAssets(
    @Args('address', { type: () => [AddressInputType], nullable: false })
    addresses: AddressInputType[],
  ): Promise<IAddressAssets[]> {
    return this.currencyService.multyAddressAssets(addresses);
  }
}
