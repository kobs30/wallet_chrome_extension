import ReactDOM from 'react-dom/client';

import { App } from './core/App';
import { RootStoreProvider } from './core/RootStore';

import './assets/css/global.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <RootStoreProvider>
    <App />
  </RootStoreProvider>
);
