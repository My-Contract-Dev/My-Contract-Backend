import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { ContractService } from 'src/modules/contract/contract.service';
import { CubeService } from 'src/modules/cube/cube.service';
import { AggregatedEventDto } from '../models';

@Injectable()
export class EventsResolver {
  constructor(
    private cubeService: CubeService,
    private contractService: ContractService,
  ) {}

  @Query(() => [AggregatedEventDto])
  async popularEvents(
    @Args('address', { nullable: false })
    address: string,
  ): Promise<AggregatedEventDto[]> {
    const data = await this.cubeService.getPopularEvents(address);
    const topicNames = data.map((item) => item.topic);
    const decodedTopicNames = await this.contractService.decodeContractTopic(
      9001,
      address,
      topicNames,
    );
    return data.map((item, index) => ({
      name: decodedTopicNames[index].split('(')[0],
      count: item.count,
    }));
  }
}
