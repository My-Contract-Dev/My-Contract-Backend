/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cacheable } from '@type-cacheable/core';
import { GraphQLClient } from 'graphql-request';
import cubejs, { CubejsApi } from '@cubejs-client/core';

import { ICubeContractData } from './models';
import { getSdk } from './schema.generated';

@Injectable()
export class CubeService {
  private client: GraphQLClient;
  private sdk: ReturnType<typeof getSdk>;
  private cubeClient: CubejsApi;

  constructor(private configService: ConfigService) {
    const apiToken = configService.get<string>('CUBE_KEY') || '';
    const apiUrl = configService.get<string>('CUBE_ENDPOINT') || '';
    const restApiUrl = configService.get<string>('CUBE_REST_ENDPOINT') || '';
    this.client = new GraphQLClient(apiUrl, {
      headers: {
        Authorization: apiToken,
      },
    });
    this.sdk = getSdk(this.client);
    this.cubeClient = cubejs(apiToken, {
      apiUrl: restApiUrl,
    });
  }

  @Cacheable({ ttlSeconds: 5 })
  async getContractData(
    addresses: string[],
    dateRange: string[] = ['Last 7 days'],
  ): Promise<ICubeContractData> {
    const data = await this.sdk.AccountData({
      addresses: addresses.map((a) => a.toLocaleLowerCase()),
      dateRange,
    });
    return data.cube.reduce<ICubeContractData>(
      (acc, item) => ({
        calls: acc.calls + item.transactions.count!,
        users: acc.users + item.transactions.fromAddressesCount!,
      }),
      {
        calls: 0,
        users: 0,
      },
    );
  }

  async getPopularEvents(address: string, dateRange = 'Last 7 days') {
    const data = await this.cubeClient.load({
      order: {
        'Logs.count': 'desc',
      },
      measures: ['Logs.count'],
      timeDimensions: [
        {
          dimension: 'Logs.blockTimestamp',
          granularity: 'year',
          dateRange,
        },
      ],
      dimensions: ['Logs.eventName'],
      filters: [
        {
          member: 'Logs.address',
          operator: 'equals',
          values: [address],
        },
      ],
    });
    return data.rawData().map((e) => ({
      topic: e['Logs.eventName'] as string,
      count: e['Logs.count'] as number,
    }));
  }
}
