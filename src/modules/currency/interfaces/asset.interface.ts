export interface IAsset {
  name: string;
  balance: string;
  price: number;
  decimals: number;
  type: string;
  inUsd: number;
  icon?: string;
  symbol?: string;
}
