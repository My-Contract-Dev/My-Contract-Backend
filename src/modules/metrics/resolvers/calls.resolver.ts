import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { ContractService } from 'src/modules/contract/contract.service';
import { CubeService } from 'src/modules/cube/cube.service';
import { prepareAddress } from 'src/utils';
import {
  AggregatedCallDto,
  ContractInputDto,
  SimpleChartValueDto,
} from '../models';

@Injectable()
export class CallsResolver {
  constructor(
    private cubeService: CubeService,
    private contractService: ContractService,
  ) {}

  @Query(() => [AggregatedCallDto])
  async popularCalls(
    @Args('contract', { nullable: false, type: () => ContractInputDto })
    contract: ContractInputDto,
  ): Promise<AggregatedCallDto[]> {
    const data = await this.cubeService.getPopularCalls(
      prepareAddress(contract.address),
    );
    const methods = data.map((c) => c.method);
    const decodedMethods = await this.contractService.decodeContractCallsigns(
      contract.chainId,
      prepareAddress(contract.address),
      methods,
    );
    return data.map((item, index) => ({
      count: item.count,
      name: decodedMethods[index].split('(')[0],
    }));
  }

  @Query(() => [SimpleChartValueDto])
  async totalCalls(
    @Args('contract', { nullable: false, type: () => ContractInputDto })
    contract: ContractInputDto,
  ): Promise<SimpleChartValueDto[]> {
    const data = await this.cubeService.getTotalCalls(
      prepareAddress(contract.address),
    );
    return data.map((item) => ({
      timestamp: item.timestamp,
      value: item.count,
    }));
  }
}
