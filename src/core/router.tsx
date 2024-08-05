import { createHashRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';
import { autorun } from 'mobx';

import {
  Login,
  Settings,
  Accounts,
  SendPage,
  IndexPage,
  ChoicePage,
  NotFoundPage,
  ResetCachePage,
  WelcomeBackPage,
  ConfirmSendPage,
  AccountDetailsPage,
} from 'pages';

import { useRootStore } from './RootStore';

export const LocationTracker: FC<{ children: ReactNode }> = observer(function LocationTracker_(
  props
) {
  const { children } = props;

  const rootStore = useRootStore();
  const navigate = useNavigate();

  // TODO: HERE (если на странице нажата кнопка "Send", отправляем юзера на /send-confirm
  useEffect(() => {
    return autorun(() => {
      if (rootStore.transaction.webSend) {
        navigate('/send-confirm');
      }
    });
  }, []);

  useEffect(() => {
    try {
      chrome.storage.session.get('send').then(({ send }) => {
        if (rootStore.vault.password && send) {
          navigate('/send');
        }
      });
    } catch (e) {
      /* empty */
    }
  }, []);

  return <>{children}</>;
});

export const AuthenticatedRoutes = observer(function WalletRoutes_() {
  const location = useLocation();

  const rootStore = useRootStore();

  if (rootStore.vault.areAccountsAvailable) {
    if (
      location.pathname !== '/welcome-back' &&
      location.pathname !== '/reset-cache' &&
      !rootStore.vault.password
    ) {
      return <Navigate to="/welcome-back" replace state={{ from: location }} />;
    }
    return (
      <LocationTracker>
        <Outlet />
      </LocationTracker>
    );
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
});

export const router = createHashRouter([
  {
    path: '/',
    element: <AuthenticatedRoutes />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: '/welcome-back',
        element: <WelcomeBackPage />,
      },
      {
        path: '/send',
        element: <SendPage />,
      },
      {
        path: '/accounts',
        element: <Accounts.AccountsPage />,
      },
      {
        path: '/accounts/import-account',
        element: <Accounts.ImportAccountPage />,
      },
      {
        path: '/accounts/add-account',
        element: <Accounts.AddAccountPage />,
      },
      {
        path: '/account-details/:accountAddress',
        element: <AccountDetailsPage />,
      },
      {
        path: '/reset-cache',
        element: <ResetCachePage />,
      },
      {
        path: '/settings',
        element: <Settings.SettingsPage />,
      },
      {
        path: '/settings/network-gateway',
        element: <Settings.NetworkGatewayPage />,
      },
      {
        path: '/settings/change-password',
        element: <Settings.ChangePasswordPage />,
      },
      {
        path: '/send-confirm',
        element: <ConfirmSendPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login.LoginPage />,
  },
  {
    path: '/login/new-account',
    element: <Login.NewAccountPage />,
  },
  {
    path: '/choice',
    element: <ChoicePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
