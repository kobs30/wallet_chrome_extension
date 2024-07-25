import { makeAutoObservable, runInAction } from 'mobx';

import * as t from 'global/types';
import type { RootStore } from 'core';

export class Token implements t.Token {
  constructor(private readonly rootStore: RootStore, token: t.Token, isUninitialized: boolean) {
    makeAutoObservable(this);

    this.type = token.type;
    this.symbol = token.symbol;
    this.address = token.address;
    this.name = token.name;
    this.description = token.description;
    this.isUninitialized = isUninitialized;

    this.fetchBalance().catch(() => void 0);
  }

  type = '';
  symbol = '';
  address = '';
  name = '';
  description = '';

  balance = 0;
  isBalanceLoading = false;
  isBalanceUninitialized = true;
  isUninitialized = true;

  fetchBalance = async (): Promise<void> => {
    // if (!this.isBalanceUninitialized) return;
    runInAction(() => {
      this.isBalanceLoading = true;
    });
    try {
      const { balance } = await this.rootStore.network.client.getTokenBalance({
        addr: this.rootStore.wallet.activeAccount?.address,
        token: this.address,
      });
      runInAction(() => {
        this.balance = Number(balance);
      });
    } finally {
      runInAction(() => {
        this.isBalanceLoading = false;
        this.isBalanceUninitialized = false;
      });
    }
  };
}
