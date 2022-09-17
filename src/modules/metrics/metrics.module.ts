import { Module } from '@nestjs/common';
import { CubeModule } from '../cube/cube.module';
import { AccountMetricsResolver } from './resolvers';

@Module({
  imports: [CubeModule],
  providers: [AccountMetricsResolver],
})
export class MetricsModule {}
