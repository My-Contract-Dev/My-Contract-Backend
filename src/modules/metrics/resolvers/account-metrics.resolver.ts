import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AccountMetrics } from '../models';

@Resolver(() => AccountMetrics)
export class AccountMetricsResolver {
  @Query(() => AccountMetrics)
  async accountMetrics(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<AccountMetrics> {
    return {
      calls: 10 + id,
    };
  }
}
