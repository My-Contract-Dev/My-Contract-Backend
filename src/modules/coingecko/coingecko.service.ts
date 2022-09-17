import { Injectable } from '@nestjs/common';
import { Cacheable } from '@type-cacheable/core';
import { CoinGeckoClient, CoinListResponseItem } from 'coingecko-api-v3';

@Injectable()
export class CoinGeckService {
  private client: CoinGeckoClient;

  constructor() {
    this.client = new CoinGeckoClient({
      autoRetry: true,
    });
  }

  private nativeCoinId(chainId: number): string {
    switch (chainId) {
      case 9001:
      case 9000:
        return 'evmos';
      default:
        throw new Error(`Chain id ${chainId} is not supported`);
    }
  }

  async coinsList(platform: string) {
    const nativeList = await this.fullCoinsList();
    return nativeList.reduce<Record<string, CoinListResponseItem>>((acc, v) => {
      const newValue = { ...acc };
      if (v.platforms && v.platforms[platform]) {
        const address = v.platforms[platform];
        newValue[address] = v;
      }
      return newValue;
    }, {});
  }

  async exchangeRates<T extends string>(
    coins: T[],
    chainId: number,
    currency = 'usd',
  ): Promise<Record<T, number> & { native: number }> {
    const rates = await this.rawExchangeRate(
      [...coins, this.nativeCoinId(chainId)],
      currency,
    );

    const result = Object.entries(rates).reduce<Record<T, number>>(
      (acc, item) => ({
        ...acc,
        [item[0]]: item[1][currency],
      }),
      {} as Record<T, number>,
    );
    return {
      ...result,
      native: rates[this.nativeCoinId(chainId)][currency],
    };
  }

  @Cacheable({ ttlSeconds: 60 * 60 })
  private async rawExchangeRate(coins: string[], currency = 'usd') {
    return this.client.simplePrice({
      ids: coins.join(','),
      vs_currencies: currency,
    });
  }

  @Cacheable({ ttlSeconds: 60 * 60 * 24 })
  private async fullCoinsList() {
    return await this.client.coinList({ include_platform: true });
  }
}
