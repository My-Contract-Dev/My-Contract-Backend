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
        gas: acc.gas + (item.transactions.gas ?? 0),
        averageGas:
          acc.averageGas > 0
            ? (acc.averageGas + (item.transactions.averageGas ?? 0)) / 2
            : item.transactions.averageGas ?? 0,
      }),
      {
        calls: 0,
        users: 0,
        gas: 0,
        averageGas: 0,
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

  async getPopularCalls(address: string, dateRange = 'Last 7 days') {
    const data = await this.cubeClient.load({
      order: {
        'Transactions.count': 'desc',
      },
      measures: ['Transactions.count'],
      timeDimensions: [
        {
          dimension: 'Transactions.blockTimestamp',
          granularity: 'year',
          dateRange,
        },
      ],
      dimensions: ['Transactions.callsign'],
      filters: [
        {
          member: 'Transactions.toAddress',
          operator: 'equals',
          values: [address],
        },
      ],
    });
    return data.rawData().map((e) => ({
      method: e['Transactions.callsign'] as string,
      count: e['Transactions.count'] as number,
    }));
  }

  async getTotalEvents(address: string, dateRange = 'Last 7 days') {
    const data = await this.sdk.EventsCountQuery({
      addresses: [address],
      dateRange,
    });

    return data.cube.map((value) => ({
      count: value.logs.count!,
      timestamp: value.logs.blockTimestamp!.day as string,
    }));
  }

  async getTotalCalls(address: string, dateRange = 'Last 7 days') {
    const data = await this.sdk.CallsCountQuery({
      addresses: [address],
      dateRange,
    });

    return data.cube.map((value) => ({
      count: value.transactions.count!,
      timestamp: value.transactions.blockTimestamp!.day as string,
    }));
  }

  async getCallsByGas(address: string, dateRange = 'Last 7 days') {
    const data = await this.cubeClient.load({
      order: {
        'Transactions.averageGas': 'desc',
      },
      measures: ['Transactions.averageGas', 'Transactions.gas'],
      timeDimensions: [
        {
          dimension: 'Transactions.blockTimestamp',
          granularity: 'year',
          dateRange,
        },
      ],
      dimensions: ['Transactions.callsign'],
      filters: [
        {
          member: 'Transactions.toAddress',
          operator: 'equals',
          values: [address],
        },
      ],
    });
    return data.rawData().map((e) => ({
      method: e['Transactions.callsign'] as string,
      averageGas: e['Transactions.averageGas'] as number,
      totalGas: e['Transactions.gas'] as number,
    }));
  }

  async averageGasByDay(address: string, dateRange = 'Last 7 days') {
    const data = await this.sdk.GasByDayQuery({
      addresses: [address],
      dateRange,
    });
    return data.cube.map((item) => ({
      averageGas: item.transactions.averageGas as number,
      timestamp: item.transactions.blockTimestamp!.day as string,
    }));
  }

  async contractsCalls(
    address: string[],
    dateRange: string | string[] = 'Last 7 days',
  ) {
    const data = await this.cubeClient.load({
      order: {
        'Transactions.count': 'desc',
      },
      measures: ['Transactions.count'],
      timeDimensions: [
        {
          dimension: 'Transactions.blockTimestamp',
          // dateRange,
          dateRange: dateRange as [string, string],
        },
      ],
      dimensions: ['Transactions.toAddress'],
      filters: [
        {
          member: 'Transactions.toAddress',
          operator: 'contains',
          values: address,
        },
      ],
    });
    return data.rawData().map((e) => ({
      address: e['Transactions.toAddress'] as string,
      count: e['Transactions.count'] as number,
    }));
  }
}
