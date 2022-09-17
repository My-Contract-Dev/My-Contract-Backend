/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AssetsService } from 'src/modules/assets/assets.service';
import { CubeService } from 'src/modules/cube/cube.service';
import { AccountMetrics } from '../models';

@Resolver(() => AccountMetrics)
export class AccountMetricsResolver {
  constructor(
    private cube: CubeService,
    private currencyService: AssetsService,
  ) {}

  @Query(() => AccountMetrics)
  async accountMetrics(
    @Args('addresses', { type: () => [String], nullable: false })
    addresses: string[],
    @Args('dateRange', { type: () => [String], nullable: true })
    dateRange?: string[],
  ): Promise<AccountMetrics> {
    const cubeContractData = await this.cube.getContractData(
      addresses,
      dateRange,
    );
    const assets = await this.currencyService.multyAddressAssets(
      addresses.map((a) => ({
        address: a,
        chainId: 9001,
      })),
    );
    return {
      calls: cubeContractData.calls,
      users: cubeContractData.users,
      balanceInUsd: assets.reduce(
        (acc, a) => acc + a.assets.reduce((acc, a) => acc + a.inUsd, 0),
        0,
      ),
    };
  }
}
