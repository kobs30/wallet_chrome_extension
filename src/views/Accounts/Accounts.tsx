import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Add, UploadNew } from 'components/icons';
import { TwoColumnFooter } from 'components';
import { useRootStore } from 'core';

import styles from './Accounts.module.scss';
import { AccountListItem } from '../common';

export const Accounts: FC = observer(function Accounts_() {
  const rootStore = useRootStore();

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.accountsList}>
        {rootStore.wallet.accounts.map((a) => {
          return <AccountListItem key={a.address} account={a} displayMoreButton />;
        })}
      </div>
      <div className={styles.footer}>
        <TwoColumnFooter
          leftColumn={{
            icon: <UploadNew />,
            label: 'Import Account',
            onClick: () => navigate('/accounts/import-account'),
          }}
          rightColumn={{
            icon: <Add />,
            label: 'Add Account',
            onClick: () => navigate('/accounts/add-account'),
          }}
        />
      </div>
    </div>
  );
});
