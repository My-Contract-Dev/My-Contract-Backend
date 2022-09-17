/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CubeService } from 'src/modules/cube/cube.service';
import { AccountMetrics } from '../models';

@Resolver(() => AccountMetrics)
export class AccountMetricsResolver {
  constructor(private cube: CubeService) {}

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
    return cubeContractData;
  }
}
