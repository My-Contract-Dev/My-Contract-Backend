import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { ContractService } from 'src/modules/contract/contract.service';
import { CubeService } from 'src/modules/cube/cube.service';
import {
  AggregatedEventDto,
  ContractInputDto,
  SimpleChartValueDto,
} from '../models';

@Injectable()
export class EventsResolver {
  constructor(
    private cubeService: CubeService,
    private contractService: ContractService,
  ) {}

  @Query(() => [AggregatedEventDto])
  async popularEvents(
    @Args('contract', { nullable: false, type: () => ContractInputDto })
    contract: ContractInputDto,
  ): Promise<AggregatedEventDto[]> {
    const data = await this.cubeService.getPopularEvents(contract.address);
    const topicNames = data.map((item) => item.topic);
    const decodedTopicNames = await this.contractService.decodeContractTopic(
      contract.chainId,
      contract.address,
      topicNames,
    );
    return data.map((item, index) => ({
      name: decodedTopicNames[index].split('(')[0],
      count: item.count,
    }));
  }

  @Query(() => [SimpleChartValueDto])
  async totalEvents(
    @Args('contract', { nullable: false, type: () => ContractInputDto })
    contract: ContractInputDto,
  ): Promise<SimpleChartValueDto[]> {
    const data = await this.cubeService.getTotalEvents(contract.address);
    return data.map((item) => ({
      timestamp: item.timestamp,
      value: item.count,
    }));
  }
}
