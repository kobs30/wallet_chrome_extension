import { makeAutoObservable } from 'mobx';

import type { RootStore } from 'core';

export class Api {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  isReady = false;

  listen = (
    callback: (request: any, sender: chrome.runtime.MessageSender) => void
  ): (() => void) => {
    const listener = (request: any, sender: chrome.runtime.MessageSender, sendResponse: any) => {
      if (typeof callback !== 'function') return false;
      callback(request, sender);
      sendResponse(true);
    };
    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  };
}
