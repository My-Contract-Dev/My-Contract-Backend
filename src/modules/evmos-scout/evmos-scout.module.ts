import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EvmosScoutService } from './evmos-scout.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://evm.evmos.org/api',
    }),
  ],
  providers: [EvmosScoutService],
  exports: [EvmosScoutService],
})
export class EvmosScoutModule {}
