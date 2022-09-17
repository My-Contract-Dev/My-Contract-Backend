import { Module } from '@nestjs/common';
import { EvmosScoutModule } from '../evmos-scout/evmos-scout.module';
import { ContractService } from './contract.service';

@Module({
  imports: [EvmosScoutModule],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
