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
import { SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphqlInterceptor } from '@ntegral/nestjs-sentry';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'https://25bdaaa3aa914c1aa93bcd22f3cb1adf@o1418233.ingest.sentry.io/6761124',
      debug: false,
      environment:
        process.env.NODE_ENV === 'dev' ? 'development' : 'production',
      logLevels: ['debug'],
    }),
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
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
})
export class AppModule {}
