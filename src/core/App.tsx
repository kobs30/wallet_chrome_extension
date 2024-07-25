import { FC, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';

import { PagesStoreProvider } from 'pages';

import { router } from './router';
import { RootStoreProvider, useRootStore } from './RootStore';
import { IS_PLUGIN } from '../config';

export const Pages = observer(() => {
  const rootStore = useRootStore();

  useEffect(() => {
    try {
      const disposer = rootStore.api.listen();
      return () => {
        disposer();
      };
    } catch (e) {
      console.error(e);
    }
  }, []);

  // TODO: HERE
  useEffect(() => {
    const listenMessagesDisposer = rootStore.web.listenMessages();

    const disposer = autorun(() => {
      if (!rootStore.vault.password || rootStore.wallet.accounts.length === 0) return;
      if (!rootStore.web.isReady) return;
      rootStore.web.sendActiveAddress();
      rootStore.web.sendNativeBalance();
    });

    return () => {
      listenMessagesDisposer();
      disposer();
    };
  }, []);

  useEffect(() => {
    const disposer = autorun(() => {
      if (rootStore.vault.password) {
        if (rootStore.wallet.accounts.length === 0) {
          const accounts = rootStore.vault.retrieveAccounts();
          rootStore.wallet.setAccounts(accounts);
        }

        rootStore.vault.syncAccounts();
      }
    });
    return () => {
      disposer();
    };
  }, []);

  return <RouterProvider router={router} />;
});

export const VaultWatcher = observer(() => {
  const rootStore = useRootStore();

  useEffect(() => {
    const disposer = autorun(() => {
      const password = rootStore.vault.password;
      const nativeBalance = rootStore.tokens.native;
      console.log(rootStore);

      try {
        chrome.runtime.sendMessage(
          {
            action: 'VAULT_PASSWORD_CHANGE',
            password,
            nativeBalance,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.log('Error sending message:', chrome.runtime.lastError.message);
            } else if (response && response.status !== 'success') {
              console.log('Unexpected response status:', response.status);
            }
          }
        );
      } catch (error) {
        console.log('Exception while sending message:', error);
      }
    });

    return () => {
      disposer();
    };
  }, [rootStore, rootStore.vault.password, rootStore.tokens.native]);

  return null;
});

export const App: FC = () => {
  if (!IS_PLUGIN) {
    document.documentElement.style.setProperty('--plugin-width', '320px');
    document.documentElement.style.setProperty('--plugin-height', '400px');
  }

  return (
    <RootStoreProvider>
      <VaultWatcher />
      <PagesStoreProvider>
        <Pages />
      </PagesStoreProvider>
    </RootStoreProvider>
  );
};
