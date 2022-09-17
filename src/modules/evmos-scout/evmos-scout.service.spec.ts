import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { expect } from 'chai';
import { EvmosScoutService } from './evmos-scout.service';

describe('Evmos scout service', () => {
  let evmosScoutService: EvmosScoutService;

  beforeEach(() => {
    const httpService = new HttpService(
      axios.create({
        baseURL: 'https://evm.evmos.org/api',
      }),
    );
    evmosScoutService = new EvmosScoutService(httpService);
  });

  test('should work', async () => {
    const data = await evmosScoutService.getAddressTokens(
      1,
      '0x067eC87844fBD73eDa4a1059F30039584586e09d',
    );
    expect(data).to.be.an('array');
  });
});
