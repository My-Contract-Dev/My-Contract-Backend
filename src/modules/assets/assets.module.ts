import { Module } from '@nestjs/common';
import { CoingeckoModule } from '../coingecko/coingecko.module';
import { EvmosScoutModule } from '../evmos-scout/evmos-scout.module';
import { AssetsService } from './assets.service';
import { AssetsResolver } from './resolvers';

@Module({
  imports: [EvmosScoutModule, CoingeckoModule],
  providers: [AssetsService, AssetsResolver],
  exports: [AssetsService],
})
export class AssetsModule {}
