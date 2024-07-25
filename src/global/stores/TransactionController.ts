import { makeAutoObservable, runInAction } from 'mobx';
import { sha256 } from 'crypto-hash';
import * as wif from 'wif';

import { Bitcoin } from 'assets/js/bitcoinjs-lib';
import { sign_message, verify_message } from 'assets/js/bitcoinsig';
import type { RootStore } from 'core';

import { TxSendRequest } from './NetworkClient';

const BitcoinLegacy = Bitcoin as any;
const signMessageLegacy = sign_message as any;
const verifyMessageLegacy = verify_message as any;

type SendValues = {
  token: string; // address
  to: string; // address
  amount: number;
  signMessage: string;
  feeCurrency: string;
};

export class TransactionController {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  webSend: SendValues | undefined = undefined;

  isSendLoading = false;

  setWebSend = (values: SendValues): void => {
    this.webSend = values;
  };

  resetWebSend = (): void => {
    this.webSend = undefined;
  };

  #signMessage = (token: string, address: string, amount: number, data = '') => {
    if (data) {
      return JSON.stringify({
        method: 'execute',
        data,
      });
    }
    if (token === 'native') {
      return JSON.stringify({
        method: 'execute',
        data: `transfer("${address}", ${amount * 100})`,
      });
    }
    return JSON.stringify({
      method: 'execute',
      data: `callContract("${token}", "transfer", "${address}", ${amount})`,
    });
  };

  getSendRequest = async (values: SendValues): Promise<TxSendRequest> => {
    const message = this.#signMessage(values.token, values.to, values.amount, values.signMessage);
    const sendRequest: TxSendRequest = {
      vm: '', // ignore
      hash: '',
      signature: '',
      message,
      currencyFee: values.feeCurrency === 'native' ? '' : values.feeCurrency,
      sender: this.rootStore.wallet.activeAddress,
      nonce: Date.now().toString(),
    };

    //m.VM + m.Sender + m.Message.String() + m.Nonce.String() + m.FeeCurrency
    const signPayload =
      sendRequest.vm +
      sendRequest.sender +
      sendRequest.message +
      sendRequest.nonce +
      sendRequest.currencyFee;

    const pk = new BitcoinLegacy.ECKey(
      Array.from(wif.decode(this.rootStore.wallet.activeAccount.pk).privateKey)
    );
    const sign = signMessageLegacy(pk, signPayload, false);
    const verify = verifyMessageLegacy(sign, signPayload);

    if (!verify) return Promise.reject();

    sendRequest.signature = sign;

    sendRequest.hash = await sha256(
      sendRequest.vm +
        sendRequest.signature +
        sendRequest.sender +
        sendRequest.message +
        sendRequest.nonce +
        sendRequest.currencyFee
    );

    return sendRequest;
  };

  send = async (values: SendValues): Promise<string> => {
    runInAction(() => {
      this.isSendLoading = true;
    });
    try {
      const sendRequest = await this.getSendRequest(values);
      const { txHash } = await this.rootStore.network.client.send(sendRequest);
      return txHash;
      // eslint-disable-next-line no-useless-catch
    } catch (e) {
      throw e;
      /* empty */
    } finally {
      runInAction(() => {
        this.isSendLoading = false;
      });
    }
  };

  estimateFee = async (
    values: {
      token: string;
      to: string;
      amount: number;
      signMessage: string;
      feeCurrency: string;
    },
    signal?: AbortSignal
  ): Promise<number> => {
    runInAction(() => {
      this.isSendLoading = true;
    });
    try {
      const sendRequest = await this.getSendRequest(values);
      const { input, output } = await this.rootStore.network.client.estimateFee(
        sendRequest,
        signal
      );
      return (input + output) / 100;
      // eslint-disable-next-line no-useless-catch
    } catch (e) {
      throw e;
      /* empty */
    } finally {
      runInAction(() => {
        this.isSendLoading = false;
      });
    }
  };
}
