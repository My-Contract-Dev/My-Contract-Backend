import { Injectable } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import { Cacheable } from '@type-cacheable/core';
import { BigNumber } from 'ethers';
import { prepareAddress } from 'src/utils';
import { CoinGeckService } from '../coingecko/coingecko.service';
import { EvmosScoutService } from '../evmos-scout/evmos-scout.service';
import { IEvmosScoutTokensBalance } from '../evmos-scout/models';
import { IAddress, IAddressAssets } from './interfaces';

@Injectable()
export class AssetsService {
  constructor(
    private scout: EvmosScoutService,
    private coinGecko: CoinGeckService,
    private sentryService: SentryService,
  ) {}

  @Cacheable({ ttlSeconds: 30 })
  async addressAssets(contract: IAddress): Promise<IAddressAssets> {
    const address = prepareAddress(contract.address);
    const { chainId } = contract;
    let tokens: IEvmosScoutTokensBalance[] = [];
    try {
      tokens = await this.scout.getAddressTokens(chainId, address);
    } catch (e) {
      this.sentryService.error(e);
    }
    // TODO: use generic platform
    const availableTokens = await this.coinGecko.coinsList('evmos');
    const payableTokens = tokens
      .filter((token) => {
        return !!availableTokens[token.contractAddress];
      })
      .map((t) => ({
        ...t,
        metadata: availableTokens[t.contractAddress],
      }));
    const tokenIds = payableTokens.map((t) => t.metadata.id || '');
    const exchangeRates = await this.coinGecko.exchangeRates(tokenIds, chainId);
    let nativeBalance = '0x0';
    try {
      nativeBalance = await this.scout.getBalance(chainId, address);
    } catch (e) {
      this.sentryService.error(e);
    }

    return {
      address,
      assets: [
        {
          balance: nativeBalance,
          decimals: 18,
          name: 'EVMOS',
          price: exchangeRates['evmos'],
          type: 'native',
          symbol: 'EVMOS',
          inUsd: this.convertValue(nativeBalance, 18, exchangeRates['evmos']),
        },
        ...payableTokens.map((t) => ({
          name: t.metadata.name || t.name || '',
          price: exchangeRates[t.metadata.id || ''],
          balance: t.balance,
          type: t.type,
          decimals: Number(t.decimals),
          symbol: t.metadata.symbol,
          inUsd: this.convertValue(
            t.balance,
            Number(t.decimals),
            exchangeRates[t.metadata.id || ''],
          ),
        })),
      ],
    };
  }

  async multyAddressAssets(addresses: IAddress[]): Promise<IAddressAssets[]> {
    return Promise.all(addresses.map((a) => this.addressAssets(a)));
  }

  convertValue(value: string, decimals: number, price: number): number {
    const mul = 1000000;
    const balance = BigNumber.from(value)
      .mul(Math.round(price * mul))
      .div(BigNumber.from(10).pow(decimals));
    return balance.toNumber() / mul;
  }
}
