import { ModuleMetadata } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface CacheAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
  inject?: any[];
}
