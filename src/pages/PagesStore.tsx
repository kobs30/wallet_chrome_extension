import { makeAutoObservable } from 'mobx';
import { createContext, FC, ReactNode, useContext } from 'react';

import { SendPageStore } from './SendPage/SendPageStore';
import { LoginPageStore } from './login/LoginPage/LoginPageStore';

export class PagesStore {
  constructor() {
    makeAutoObservable(this);
  }

  send = new SendPageStore();
  login = new LoginPageStore();
}

const pagesStoreContext = createContext<PagesStore | null>(null);

export const usePagesStore = () => {
  const context = useContext(pagesStoreContext);
  if (!context) {
    throw Error(
      'PagesStoreProvider is not used! Please provide pagesStoreContext before using usePagesStore'
    );
  }
  return context;
};

const pagesStore = new PagesStore();

export type PagesStoreProviderProps = {
  children: ReactNode;
};

export const PagesStoreProvider: FC<PagesStoreProviderProps> = ({ children }) => {
  return <pagesStoreContext.Provider value={pagesStore}>{children}</pagesStoreContext.Provider>;
};
