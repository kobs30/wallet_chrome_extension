import { makeAutoObservable } from 'mobx';

import type { RootStore } from 'core';

export class Api {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  isReady = false;

  listen = (): (() => void) => {
    const listener = (message: any, sender: chrome.runtime.MessageSender, sendResponse: any) => {
      console.log('message=', message);
      console.log('sender=', sender);
      console.log('response=', sendResponse);
    };
    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  };
}
