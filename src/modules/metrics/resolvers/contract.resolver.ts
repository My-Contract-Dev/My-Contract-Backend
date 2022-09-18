import { ResolveField, Resolver } from '@nestjs/graphql';
import { EvmosScoutService } from 'src/modules/evmos-scout/evmos-scout.service';
import { ContractWithBalanceDto } from '../models';

@Resolver(() => ContractWithBalanceDto)
export class ContractResolver {
  constructor(private evmosService: EvmosScoutService) {}

  @ResolveField(() => String, { nullable: true })
  async name(contract: ContractWithBalanceDto): Promise<string | undefined> {
    try {
      const contractName = await this.evmosService.getContractName(
        contract.chainId,
        contract.address,
      );
      return contractName;
    } catch {
      return;
    }
  }
}
