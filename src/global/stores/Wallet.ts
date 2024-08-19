import * as wif from 'wif';
import * as bitcoin from 'bitcoinjs-lib';
import { makeAutoObservable } from 'mobx';
import { ECPairFactory } from 'ecpair';
import ecc from '@bitcoinerlab/secp256k1';
import { validate as validateAddress } from 'bitcoin-address-validation';

import type { RootStore } from 'core';
import { Bitcoin, Crypto } from 'assets/js/bitcoinjs-lib';

import { Account } from './Account';
import * as t from '../types';
import { IS_PLUGIN } from '../../config';

const ACTIVE_ADDRESS_LS_KEY = 'addr';

const network = bitcoin.networks.bitcoin;
const ECPair = ECPairFactory(ecc);

const BitcoinLegacy = Bitcoin as any;
const CryptoLegacy = Crypto as any;

//TODO: Make assets - token / account / ...
export class Wallet {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);

    if (IS_PLUGIN) {
      chrome.storage.local.get('activeAddress', (items) => {
        if ('activeAddress' in items) {
          this.activeAddress = items.activeAddress || '';
        }
      });
    } else {
      this.activeAddress = localStorage.getItem(ACTIVE_ADDRESS_LS_KEY) ?? '';
    }
  }

  activeAddress = '';
  accounts: Account[] = [];

  setActiveAddress = (address: string): void => {
    this.rootStore.resetTokens();
    if (IS_PLUGIN) {
      chrome.storage.local.set({ activeAddress: address }, () => void 0);
    } else {
      localStorage.setItem(ACTIVE_ADDRESS_LS_KEY, address);
    }
    this.activeAddress = address;
  };

  setAccounts = (accounts: t.Account[]): void => {
    this.accounts = accounts.map((a) => {
      return new Account(a.name, a.address, a.pk);
    });
  };

  #_addressToString = (address: { hash: any; version: number }): string => {
    const e = Array.from(address.hash);
    e.unshift(address.version);
    const t = CryptoLegacy.SHA256(
        CryptoLegacy.SHA256(e, {
          asBytes: true,
        }),
        {
          asBytes: true,
        }
      ),
      n = e.concat(t.slice(0, 4));
    return BitcoinLegacy.Base58.encode(n);
  };

  genAddress = (pubKeyHash: any) => {
    return new BitcoinLegacy.Address(pubKeyHash);
  };

  genPk = () => {
    const privateKey = new BitcoinLegacy.ECKey();
    const privateKeyBuf = Buffer.from(privateKey.priv.toString(16), 'hex');
    const privateKeyWif = wif.encode(network.wif, privateKeyBuf, false);
    return { privateKey, privateKeyWif };
  };

  genAccount = (importPkWif = '') => {
    if (importPkWif) {
      const ecPair = ECPair.fromWIF(importPkWif);
      const pubKeyHash = bitcoin.crypto.ripemd160(bitcoin.crypto.sha256(ecPair.publicKey));
      const address = this.genAddress(pubKeyHash);

      return {
        address: this.#_addressToString(address),
        pk: importPkWif,
      };
    }

    const genPk = this.genPk();
    const address = this.genAddress(genPk.privateKey.getPubKeyHash());

    return {
      address: this.#_addressToString(address),
      pk: genPk.privateKeyWif,
    };
  };

  // btc
  // p2pkhAddress = (pub: Buffer): string | undefined => {
  //   const { address } = bitcoin.payments.p2pkh({ pubkey: pub, network });
  //   return address;
  // };
  //
  // // #generateAccount = (importPk = ''): { address: string; pk: string } => {
  // //   const keyPair = importPk ? ECPair.fromWIF(importPk) : ECPair.makeRandom();
  // //   const address = this.p2pkhAddress(keyPair.publicKey) ?? '';
  // //
  // //   let pk = importPk;
  // //   if (!importPk) {
  // //     pk = keyPair.privateKey ? wif.encode(network.wif, keyPair.privateKey, false) : '';
  // //   }
  // //
  // //   return {
  // //     address,
  // //     pk,
  // //   };
  // // };

  verifyAddress = (address: string): boolean => {
    return validateAddress(address);
  };

  verifyPk = (pk: string): boolean => {
    try {
      ECPair.fromWIF(pk);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  findAccountByPk = (pk: string): Account | undefined => {
    return this.accounts.find((a) => a.pk === pk);
  };

  findAccountByAddress = (address: string): Account => {
    return this.accounts.filter((a) => a.address === address)[0];
  };

  findAccountIndexByAddress = (address: string): number => {
    return this.accounts.findIndex((a) => a.address === address);
  };

  addAccount = (name: string, importPk?: string): void => {
    const { address, pk } = this.genAccount(importPk);
    this.accounts.push(new Account(name, address, pk));
    // Set active address if only account
    if (this.accounts.length === 1) this.setActiveAddress(address);
  };

  removeAccount = (address: string): void => {
    if (this.accounts.length === 1) return;

    const accountIndex = this.findAccountIndexByAddress(address);

    // Set new active address if removed account was primary
    if (this.isActiveAccount(address)) {
      this.setActiveAddress(
        accountIndex === 0
          ? this.accounts[this.accounts.length - 1].address
          : this.accounts[0].address
      );
    }

    this.accounts.splice(accountIndex, 1);
  };

  get activeAccount(): Account {
    return this.findAccountByAddress(this.activeAddress);
  }

  isActiveAccount = (address: string): boolean => {
    return this.activeAddress === address;
  };

  reset = (): void => {
    this.setActiveAddress('');
    this.accounts = [];
  };
}
