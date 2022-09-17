import { Module } from '@nestjs/common';
import { AssetsModule } from '../assets/assets.module';
import { CubeModule } from '../cube/cube.module';
import { AccountMetricsResolver } from './resolvers';

@Module({
  imports: [CubeModule, AssetsModule],
  providers: [AccountMetricsResolver],
})
export class MetricsModule {}
