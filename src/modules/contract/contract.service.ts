import { Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import { keccak256 } from '@ethersproject/keccak256';
import { toUtf8Bytes } from '@ethersproject/strings';

import { EvmosScoutService } from '../evmos-scout/evmos-scout.service';

@Injectable()
export class ContractService {
  constructor(private evmosScoutService: EvmosScoutService) {}

  private decodeCallsignsFromAbi(
    address: string,
    abi: string,
    callsigns: string[],
  ): string[] {
    const contract = new Contract(address, abi);
    const functions = Object.keys(contract.interface.functions);
    const functionHashed = functions.reduce<Record<string, string>>(
      (acc, f) => {
        const hash = keccak256(toUtf8Bytes(f)).slice(0, 10);
        return {
          ...acc,
          [hash]: f,
        };
      },
      {},
    );
    return callsigns.map((c) => functionHashed[c] || c);
  }

  async decodeContractCallsigns(
    chainId: number,
    address: string,
    callsigns: string[],
  ): Promise<string[]> {
    let contractAbi: string | undefined;
    try {
      contractAbi = await this.evmosScoutService.getContractAbi(
        chainId,
        address,
      );
    } catch {}
    if (contractAbi) {
      return this.decodeCallsignsFromAbi(address, contractAbi, callsigns);
    }
    return callsigns;
  }

  private decodeTopicsFromAbi(address: string, abi: string, topics: string[]) {
    const contract = new Contract(address, abi);
    const events = Object.keys(contract.interface.events);
    const eventHashed = events.reduce<Record<string, string>>((acc, e) => {
      const hash = keccak256(toUtf8Bytes(e)).slice(0, 10);
      return {
        ...acc,
        [hash]: e,
      };
    }, {});
    return topics.map((t) => eventHashed[t.slice(0, 10)] || t.slice(0, 10));
  }

  async decodeContractTopic(
    chainId: number,
    address: string,
    topics: string[],
  ): Promise<string[]> {
    let contractAbi: string | undefined;
    try {
      contractAbi = await this.evmosScoutService.getContractAbi(
        chainId,
        address,
      );
    } catch {}
    if (contractAbi) {
      return this.decodeTopicsFromAbi(address, contractAbi, topics);
    }
    return topics;
  }
}
