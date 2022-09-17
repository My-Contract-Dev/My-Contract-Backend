import { Module } from '@nestjs/common';
import { CubeModule } from '../cube/cube.module';
import { CurrencyModule } from '../currency/currency.module';
import { AccountMetricsResolver } from './resolvers';

@Module({
  imports: [CubeModule, CurrencyModule],
  providers: [AccountMetricsResolver],
})
export class MetricsModule {}
