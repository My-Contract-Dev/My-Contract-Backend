import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { ContractService } from 'src/modules/contract/contract.service';
import { CubeService } from 'src/modules/cube/cube.service';
import { AggregatedMethodGasDto, SimpleChartValueDto } from '../models';

@Injectable()
export class GasResolver {
  constructor(
    private cubeService: CubeService,
    private contractService: ContractService,
  ) {}

  @Query(() => [AggregatedMethodGasDto])
  async averageGas(
    @Args('address', { nullable: false }) address: string,
  ): Promise<AggregatedMethodGasDto[]> {
    const data = await this.cubeService.getCallsByGas(address);
    const methodNames = data.map((item) => item.method);
    const decodedMethods = await this.contractService.decodeContractCallsigns(
      9001,
      address,
      methodNames,
    );
    return data.map((item, index) => ({
      name: decodedMethods[index].split('(')[0],
      averageGas: item.averageGas,
    }));
  }

  @Query(() => [SimpleChartValueDto])
  async averageGasByDate(
    @Args('address', { nullable: false }) address: string,
  ): Promise<SimpleChartValueDto[]> {
    const data = await this.cubeService.averageGasByDay(address);
    return data.map((item) => ({
      value: item.averageGas,
      timestamp: item.timestamp,
    }));
  }
}
