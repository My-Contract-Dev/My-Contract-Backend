/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';
import { ICubeContractData } from './models';
import { getSdk } from './schema.generated';

@Injectable()
export class CubeService {
  private client: GraphQLClient;
  private sdk: ReturnType<typeof getSdk>;

  constructor(private configService: ConfigService) {
    this.client = new GraphQLClient(
      configService.get<string>('CUBE_ENDPOINT') || '',
      {
        headers: {
          Authorization: configService.get<string>('CUBE_KEY') || '',
        },
      },
    );
    this.sdk = getSdk(this.client);
  }

  async getContractData(
    addresses: string[],
    dateRange: string[] = ['Last 7 days'],
  ): Promise<ICubeContractData> {
    const data = await this.sdk.AccountData({ addresses, dateRange });
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
}
