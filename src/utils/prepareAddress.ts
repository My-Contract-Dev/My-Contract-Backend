import * as converter from 'bech32-converting';

export const prepareAddress = (address: string): string => {
  let cleanAddress = address;
  if (cleanAddress.startsWith('evmos')) {
    cleanAddress = converter('evmos').toHex(address);
  }
  return cleanAddress.toLocaleLowerCase();
};
