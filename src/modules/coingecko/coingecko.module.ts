import { Module } from '@nestjs/common';
import { CoinGeckService } from './coingecko.service';

@Module({
  providers: [CoinGeckService],
  exports: [CoinGeckService],
})
export class CoingeckoModule {}
