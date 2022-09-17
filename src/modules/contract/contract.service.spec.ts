import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { expect } from 'chai';
import { EvmosScoutService } from '../evmos-scout/evmos-scout.service';
import { ContractService } from './contract.service';

describe('Contract Service', () => {
  let contractService: ContractService;

  beforeEach(() => {
    const httpClient = axios.create({
      baseURL: 'https://evm.evmos.org/api',
    });
    const httpService = new HttpService(httpClient);
    const scoutService = new EvmosScoutService(httpService);
    contractService = new ContractService(scoutService);
  });

  test('should get call sign', async () => {
    const data = await contractService.decodeContractCallsigns(
      9001,
      '0xFCd2Ce20ef8ed3D43Ab4f8C2dA13bbF1C6d9512F',
      ['0x18cbafe5'],
    );
    expect(data).to.be.an('array');
    expect(data[0]).to.be.eq(
      'swapExactTokensForETH(uint256,uint256,address[],address,uint256)',
    );
  });

  test('should get topic sign', async () => {
    const data = await contractService.decodeContractTopic(
      9001,
      '0xD4949664cD82660AaE99bEdc034a0deA8A0bd517',
      ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
    );
    expect(data).to.be.an('array');
    expect(data[0]).to.be.eq('Transfer(address,address,uint256)');
  });
});
