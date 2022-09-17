import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { CubeModule } from './modules/cube/cube.module';
import { EvmosScoutModule } from './modules/evmos-scout/evmos-scout.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    CacheModule.register(),
    ConfigModule.forRoot(),
    MetricsModule,
    CubeModule,
    EvmosScoutModule,
  ],
})
export class AppModule {}
