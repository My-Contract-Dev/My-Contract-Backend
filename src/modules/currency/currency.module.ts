import { Module } from '@nestjs/common';
import { CoingeckoModule } from '../coingecko/coingecko.module';
import { EvmosScoutModule } from '../evmos-scout/evmos-scout.module';
import { CurrencyResolver } from './resolvers/currency.resolver';
import { CurrencyService } from './currency.service';
import { AddressResolver } from './resolvers';

@Module({
  imports: [EvmosScoutModule, CoingeckoModule],
  providers: [CurrencyService, CurrencyResolver, AddressResolver],
  exports: [CurrencyService],
})
export class CurrencyModule {}
