import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AssetsModule } from './modules/assets/assets.module';
import { AppCacheModule } from './modules/cache/cache.module';
import { CoingeckoModule } from './modules/coingecko/coingecko.module';
import { ContractModule } from './modules/contract/contract.module';
import { CubeModule } from './modules/cube/cube.module';
import { EvmosScoutModule } from './modules/evmos-scout/evmos-scout.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ConfigModule.forRoot(),
    MetricsModule,
    CubeModule,
    EvmosScoutModule,
    AppCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
      }),
    }),
    CoingeckoModule,
    AssetsModule,
    ContractModule,
  ],
})
export class AppModule {}
