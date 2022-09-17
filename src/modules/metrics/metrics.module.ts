import { Module } from '@nestjs/common';
import { AssetsModule } from '../assets/assets.module';
import { ContractModule } from '../contract/contract.module';
import { CubeModule } from '../cube/cube.module';
import { AccountMetricsResolver, EventsResolver } from './resolvers';
import { CallsResolver } from './resolvers/calls.resolver';

@Module({
  imports: [CubeModule, AssetsModule, ContractModule],
  providers: [AccountMetricsResolver, EventsResolver, CallsResolver],
})
export class MetricsModule {}
