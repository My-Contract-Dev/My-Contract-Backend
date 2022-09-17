import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { AppCacheModule } from '../cache/cache.module';
import { CoinGeckService } from './coingecko.service';

describe('coinGeckoService', () => {
  let coinGeckoService: CoinGeckService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppCacheModule.register({
          host: 'localhost',
        }),
      ],
      providers: [CoinGeckService],
    }).compile();
    coinGeckoService = moduleRef.get<CoinGeckService>(CoinGeckService);
  });

  it('should get coins list', async () => {
    const list = await coinGeckoService.coinsList('evmos');
    expect(list).to.be.an('object');
  });

  it('should get prices', async () => {
    const prices = await coinGeckoService.exchangeRates([], 9001);
    expect(prices).to.have.property('native');
    expect(prices.native).to.be.a('number');
  });
});
