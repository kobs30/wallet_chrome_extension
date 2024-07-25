import { makeAutoObservable, runInAction } from 'mobx';

import type { RootStore } from 'core';

import { Token } from './Token';

export class TokensController {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  native = 0;
  isNativeLoading = false;
  isNativeUninitialized = true;

  tokens: Token[] = [];
  isLoading = false;
  isError = false;
  isUninitialized = true;

  get noBalance(): boolean {
    return this.native === 0 && this.tokens.every((t) => t.balance === 0);
  }

  fetchNativeBalance = async (): Promise<void> => {
    // if (!this.isNativeUninitialized) return;
    runInAction(() => {
      this.isNativeLoading = true;
    });
    try {
      const { balance } = await this.rootStore.network.client.getNativeBalance({
        addr: this.rootStore.wallet.activeAddress,
      });
      runInAction(() => {
        this.native = Number(balance) / 100;
      });
    } finally {
      runInAction(() => {
        this.isNativeLoading = false;
        this.isNativeUninitialized = false;
      });
    }
  };

  get noFeeTokens(): Token[] {
    return this.tokens.filter((t) => !t.address.includes('amm_'));
  }

  get feeTokens(): Token[] {
    return this.tokens.filter((t) => t.address.includes('amm_'));
  }

  fetchTokens = async (): Promise<void> => {
    // if (!this.isUninitialized) return;
    runInAction(() => {
      this.isLoading = true;
      this.isError = false;
    });
    try {
      const { tokens } = await this.rootStore.network.client.getTokens();
      runInAction(() => {
        this.tokens = tokens
          .filter((t) => {
            const feeTokens = tokens.filter((t) => t.addr.includes('amm_'));
            return feeTokens.find((tf) => tf.symbol === t.symbol);
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((t) => new Token(this.rootStore, { ...t, address: t.addr }, this.isUninitialized));
      });
    } catch (e) {
      runInAction(() => {
        this.isError = true;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.isUninitialized = false;
      });
    }
  };

  findTokenByAddress = (address: string): Token | undefined => {
    return this.tokens.find((t) => t.address === address);
  };
}
