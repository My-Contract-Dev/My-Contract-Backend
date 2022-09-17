import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CovalentService } from './covalent.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: 'https://api.covalenthq.com/v1',
        params: {
          key: configService.get<string>('COVALENT_API_KEY'),
        },
      }),
    }),
  ],
  providers: [CovalentService],
  exports: [CovalentService],
})
export class CovalentModule {}
