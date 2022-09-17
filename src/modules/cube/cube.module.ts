import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CubeService } from './cube.service';

@Module({
  imports: [ConfigModule],
  providers: [CubeService],
  exports: [CubeService],
})
export class CubeModule {}
