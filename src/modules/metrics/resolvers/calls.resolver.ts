import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { ContractService } from 'src/modules/contract/contract.service';
import { CubeService } from 'src/modules/cube/cube.service';
import { AggregatedCallDto, SimpleChartValueDto } from '../models';

@Injectable()
export class CallsResolver {
  constructor(
    private cubeService: CubeService,
    private contractService: ContractService,
  ) {}

  @Query(() => [AggregatedCallDto])
  async popularCalls(
    @Args('address', { nullable: false }) address: string,
  ): Promise<AggregatedCallDto[]> {
    const data = await this.cubeService.getPopularCalls(address);
    const methods = data.map((c) => c.method);
    const decodedMethods = await this.contractService.decodeContractCallsigns(
      9001,
      address,
      methods,
    );
    return data.map((item, index) => ({
      count: item.count,
      name: decodedMethods[index].split('(')[0],
    }));
  }

  @Query(() => [SimpleChartValueDto])
  async totalCalls(
    @Args('address', { nullable: false }) address: string,
  ): Promise<SimpleChartValueDto[]> {
    const data = await this.cubeService.getTotalCalls(address);
    return data.map((item) => ({
      timestamp: item.timestamp,
      value: item.count,
    }));
  }
}
