import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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
}
