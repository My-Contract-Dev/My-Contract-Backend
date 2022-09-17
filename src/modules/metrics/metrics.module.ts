import { Module } from '@nestjs/common';
import { AccountMetricsResolver } from './resolvers';

@Module({
  imports: [],
  providers: [AccountMetricsResolver],
})
export class MetricsModule {}
