import { makeAutoObservable } from 'mobx';

import { NETWORK_GATEWAY_URL } from 'config';

import { NetworkClient } from './NetworkClient';

const GW_LS_KEY = 'gw';

export class NetworkController {
  constructor() {
    makeAutoObservable(this);
  }

  network = localStorage.getItem(GW_LS_KEY) ?? NETWORK_GATEWAY_URL;
  client = new NetworkClient(this.network);

  get isDefaultNetwork(): boolean {
    return this.network === NETWORK_GATEWAY_URL;
  }

  setNetwork = (network: string): void => {
    this.network = network;
    this.client = new NetworkClient(network);
    localStorage.setItem(GW_LS_KEY, network);
  };

  resetNetwork = (): void => {
    this.network = NETWORK_GATEWAY_URL;
    this.client = new NetworkClient(NETWORK_GATEWAY_URL);
    localStorage.removeItem(GW_LS_KEY);
  };
}
