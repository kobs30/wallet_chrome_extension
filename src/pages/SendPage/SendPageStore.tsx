import { makeAutoObservable } from 'mobx';

export class SendPageStore {
  constructor() {
    makeAutoObservable(this);
  }

  txHash = '';

  setTxHash = (txHash: string) => {
    this.txHash = txHash;
  };

  resetTxHash = () => {
    this.txHash = '';
  };
}
