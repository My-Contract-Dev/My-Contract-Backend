export interface IEvmosScoutResponse<T> {
  result?: T;
  message: string;
  status: string;
}
