import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';

import { Button, DashBorderedBlock, FormItem } from 'components';

import styles from './AccountDetails.module.scss';
import { EnterPasswordForm } from './EnterPasswordForm/EnterPasswordForm';
import { AccountListItem } from '../common';
import { useRootStore } from '../../core';

export const AccountDetails: FC = observer(function AccountDetails_() {
  const [areDetailsShown, setAreDetailsShown] = useState(false);

  const rootStore = useRootStore();

  const params = useParams<{ accountAddress: string }>();

  if (!params.accountAddress) return '';

  const account = rootStore.wallet.findAccountByAddress(params.accountAddress);

  if (!account) return null;

  const handleCopyClick = () => {
    if (!window.isSecureContext) return;
    navigator.clipboard.writeText(account.pk).catch((e) => {
      console.error('Error during copying error message', e);
    });
  };

  return (
    <div className={styles.root}>
      <AccountListItem account={account} />
      <div className={styles.content}>
        {areDetailsShown ? (
          <div className={styles.details}>
            <FormItem
              warning="Never disclose this key. Anyone with your private keys
 can steal any assets held in your account."
            >
              <div className={styles.privateKeyWrapper}>
                <DashBorderedBlock onClick={handleCopyClick}>
                  <div className={styles.privateKey}>
                    <div className={styles.privateKeyTitle}>Private Key</div>
                    <div className={styles.privateKeyKey}>{account.pk}</div>
                  </div>
                </DashBorderedBlock>
              </div>
            </FormItem>
            <Button fullWidth onClick={handleCopyClick}>
              Copy
            </Button>
          </div>
        ) : (
          <EnterPasswordForm onSubmitSuccess={() => setAreDetailsShown(true)} />
        )}
      </div>
    </div>
  );
});
