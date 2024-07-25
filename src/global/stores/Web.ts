import { makeAutoObservable } from 'mobx';

import type { RootStore } from 'core';

// TODO: HERE
export class Web {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  isReady = false;

  listenMessages = (): (() => void) => {
    const listener = (e: MessageEvent<any>) => {
      if ('ready' in e.data) {
        this.isReady = true;
      }
      if ('messageToSign' in e.data) {
        this.rootStore.transaction.getSendRequest(e.data.messageToSign).then((sendRequest) => {
          window.parent.postMessage(
            {
              signedMessage: sendRequest,
            },
            '*'
          );
        });
      }
      if ('sendMessage' in e.data) {
        this.rootStore.transaction.setWebSend(e.data.sendMessage);
      }
    };

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    };
  };

  sendActiveAddress = (): void => {
    window.parent.postMessage(
      {
        activeAddress: this.rootStore.wallet.activeAddress,
      },
      '*'
    );
  };

  sendNativeBalance = (): void => {
    window.parent.postMessage(
      {
        nativeBalance: this.rootStore.tokens.native,
      },
      '*'
    );
  };
}
