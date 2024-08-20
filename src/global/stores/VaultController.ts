import { makeAutoObservable, runInAction } from 'mobx';
import CryptoJS from 'crypto-js';

import * as t from 'global/types';
import type { RootStore } from 'core';
import { IS_PLUGIN } from 'config';

const ACCS_STORAGE_KEY = 'accs';

export class VaultController {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);

    this.getPassword().catch(() => void 0);
  }

  storage = localStorage;

  password = '';

  getPassword = async (): Promise<void> => {
    if (IS_PLUGIN) {
      try {
        const { password } = await chrome.storage.session.get('password');
        runInAction(() => {
          this.password = password;
        });
      } catch (e) {
        runInAction(() => {
          this.password = '';
        });
        console.log('Chrome Storage APi is not available', e);
      }
    } else {
      const password = sessionStorage.getItem('password') || '';
      runInAction(() => {
        this.password = password;
      });
    }
  };

  get areAccountsAvailable(): boolean {
    const item = this.storage.getItem(ACCS_STORAGE_KEY);
    return !!item && item.length !== 0;
  }

  retrieveAccounts = (): t.Account[] => {
    try {
      // return JSON.parse(this.storage.getItem(ACCS_STORAGE_KEY) ?? '[]');
      return JSON.parse(this.#getItem(ACCS_STORAGE_KEY) ?? '[]');
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  removeAccounts = (): void => {
    this.storage.removeItem(ACCS_STORAGE_KEY);
  };

  syncAccounts = (): void => {
    // this.storage.setItem(ACCS_STORAGE_KEY, JSON.stringify(this.rootStore.wallet.accounts));
    this.#setItem(ACCS_STORAGE_KEY, JSON.stringify(this.rootStore.wallet.accounts));
  };

  #setItem = (storageKey: string, value: string): void => {
    const encryptedData = CryptoJS.AES.encrypt(value, this.password).toString();
    this.storage.setItem(storageKey, encryptedData);
  };

  #getItem = (storageKey: string): string | undefined => {
    const item = this.storage.getItem(storageKey);
    if (!item) return;
    const bytes = CryptoJS.AES.decrypt(item, this.password);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  validatePassword = (password: string): boolean => {
    try {
      const item = this.storage.getItem(ACCS_STORAGE_KEY);
      if (!item) return false;
      const d = CryptoJS.AES.decrypt(item, password).toString(CryptoJS.enc.Utf8);
      if (!d) return false;
      JSON.parse(d);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  submitPassword = async (password: string): Promise<void> => {
    if (IS_PLUGIN) {
      try {
        await chrome.storage.session.set({ password });
      } catch (e) {
        console.log(e);
      }
    } else {
      sessionStorage.setItem('password', password);
    }

    this.password = password;
  };

  setLocked = async (): Promise<void> => {
    if (IS_PLUGIN) {
      try {
        await chrome.storage.session.remove('password');
      } catch (e) {
        console.log(e);
      }
    } else {
      sessionStorage.removeItem('password');
    }

    this.password = '';
  };
}
