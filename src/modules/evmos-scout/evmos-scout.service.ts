import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cacheable } from '@type-cacheable/core';
import { lastValueFrom } from 'rxjs';
import { IEvmosScoutResponse, IEvmosScoutTokensBalance } from './models';

@Injectable()
export class EvmosScoutService {
  constructor(private httpService: HttpService) {}

  async getAddressTokens(
    chainId: number,
    address: string,
  ): Promise<IEvmosScoutTokensBalance[]> {
    const { data } = await lastValueFrom(
      this.httpService.get<IEvmosScoutResponse<IEvmosScoutTokensBalance[]>>(
        '',
        {
          params: {
            module: 'account',
            action: 'tokenlist',
            address,
          },
        },
      ),
    );
    if (!data.result) {
      throw new Error('No data');
    }
    return data.result;
  }

  async getBalance(chainId: number, address: string): Promise<string> {
    const { data } = await lastValueFrom(
      this.httpService.get<IEvmosScoutResponse<string>>('', {
        params: {
          module: 'account',
          action: 'balance',
          address,
        },
      }),
    );
    if (!data.result) {
      throw new Error('No data');
    }
    return data.result;
  }

  @Cacheable({ ttlSeconds: 60 * 60 * 24 * 14 })
  async getContractAbi(
    chainId: number,
    address: string,
  ): Promise<string | undefined> {
    const { data } = await lastValueFrom(
      this.httpService.get<IEvmosScoutResponse<string>>('', {
        params: {
          module: 'contract',
          action: 'getabi',
          address,
        },
      }),
    );
    if (!data.result) {
      throw new Error('No data');
    }
    return data.result;
  }
  @Cacheable({ ttlSeconds: 60 * 60 * 24 * 14 })
  async getContractName(chainId: number, address: string) {
    const { data } = await lastValueFrom(
      this.httpService.get<
        IEvmosScoutResponse<
          {
            ABI: string;
            ContractName: string;
          }[]
        >
      >('', {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address,
        },
      }),
    );
    if (!data.result || !data.result[0]) {
      throw new Error('No data');
    }
    return data.result[0].ContractName;
  }
}
