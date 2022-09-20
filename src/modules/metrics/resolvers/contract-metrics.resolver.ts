import { Args, Query, Resolver } from '@nestjs/graphql';
import { AssetsService } from 'src/modules/assets/assets.service';
import { CubeService } from 'src/modules/cube/cube.service';
import { prepareAddress } from 'src/utils';
import { ContractInputDto, ContractMetricsDto } from '../models';

@Resolver(() => ContractMetricsDto)
export class ContractMetricsResolver {
  constructor(
    private cubeService: CubeService,
    private assetsService: AssetsService,
  ) {}

  @Query(() => ContractMetricsDto)
  async contractMetrics(
    @Args('contracts', { type: () => ContractInputDto, nullable: false })
    contract: ContractInputDto,
    @Args('dateRange', { type: () => [String], nullable: true })
    dateRange?: string[],
  ): Promise<ContractMetricsDto> {
    const assets = await this.assetsService.addressAssets(contract);
    const totalAmount = assets.assets.reduce((acc, v) => acc + v.inUsd, 0);

    const contractMetrics = await this.cubeService.getContractData(
      [prepareAddress(contract.address)],
      dateRange,
    );

    return {
      balance: totalAmount,
      averageGasUsed: contractMetrics.averageGas,
      gasUsed: contractMetrics.gas,
      users: contractMetrics.users,
      calls: contractMetrics.calls,
    };
  }
}
