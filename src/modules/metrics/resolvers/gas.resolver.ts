import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { ContractService } from 'src/modules/contract/contract.service';
import { CubeService } from 'src/modules/cube/cube.service';
import { prepareAddress } from 'src/utils';
import {
  AggregatedMethodGasDto,
  ContractInputDto,
  SimpleChartValueDto,
} from '../models';

@Injectable()
export class GasResolver {
  constructor(
    private cubeService: CubeService,
    private contractService: ContractService,
  ) {}

  @Query(() => [AggregatedMethodGasDto])
  async averageGas(
    @Args('contract', { nullable: false, type: () => ContractInputDto })
    contract: ContractInputDto,
  ): Promise<AggregatedMethodGasDto[]> {
    const data = await this.cubeService.getCallsByGas(
      prepareAddress(contract.address),
    );
    const methodNames = data.map((item) => item.method);
    const decodedMethods = await this.contractService.decodeContractCallsigns(
      contract.chainId,
      prepareAddress(contract.address),
      methodNames,
    );
    return data.map((item, index) => ({
      name: decodedMethods[index].split('(')[0],
      averageGas: item.averageGas,
    }));
  }

  @Query(() => [SimpleChartValueDto])
  async averageGasByDate(
    @Args('contract', { nullable: false, type: () => ContractInputDto })
    contract: ContractInputDto,
  ): Promise<SimpleChartValueDto[]> {
    const data = await this.cubeService.averageGasByDay(
      prepareAddress(contract.address),
    );
    return data.map((item) => ({
      value: item.averageGas,
      timestamp: item.timestamp,
    }));
  }
}
