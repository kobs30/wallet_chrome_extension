import axios, { AxiosInstance } from 'axios';
import { makeAutoObservable } from 'mobx';

export type ApiToken = {
  type: string;
  symbol: string;
  addr: string;
  name: string;
  description: string;
};

export type TxSendRequest = {
  hash: string;
  nonce: string;
  vm: string;
  sender: string;
  signature: string;
  message: string;
  currencyFee: string;
};

export type TxSendResponse = { txHash: string };

export type TokenBalanceResponse = { balance: string };

export type TokenBalanceRequest = { addr: string; token: string };

export type NativeBalanceRequest = { addr: string };

export type NativeBalanceResponse = { balance: string };

export type EstimateFeeResponse = { input: number; output: number };

export class NetworkClient {
  constructor(public readonly baseURL: string) {
    makeAutoObservable(this);

    this.client = axios.create({
      baseURL: this.baseURL + '/api/gw/v1',
    });
  }

  client: AxiosInstance;

  // TODO: fix
  estimateFee = async (req: TxSendRequest, signal?: AbortSignal): Promise<EstimateFeeResponse> => {
    const { data } = await axios.post(
      'https://cyclonechain.com/wallet_approved_tokens/fee_estimate.php',
      req,
      { signal }
    );

    return data;
  };

  send = async (req: TxSendRequest): Promise<TxSendResponse> => {
    const { data } = await this.client.post('/transaction/send', req);
    return data;
  };

  getTokens = async (): Promise<{ tokens: ApiToken[] }> => {
    const { data } = await this.client.post('/tokens/get');
    return data;
  };

  getTokenBalance = async (req: TokenBalanceRequest): Promise<TokenBalanceResponse> => {
    const { data } = await this.client.post('/wallet/balance/token', req);
    return data;
  };

  getNativeBalance = async (req: NativeBalanceRequest): Promise<NativeBalanceResponse> => {
    const { data } = await this.client.post('/wallet/balance/native', req);
    return data;
  };
}
