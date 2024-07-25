import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { PageLayout } from 'layouts';
import { AccountInfo, WalletMain } from 'views';
import { Snackbar } from 'components';
import { IS_PLUGIN, TRANSACTION_EXPLORER_URL } from 'config';
import { OpenInNew } from 'components/icons';

import styles from './IndexPage.module.scss';
import { usePagesStore } from '../PagesStore';

const TX_RESULT_TIMEOUT = 5_000;

export const IndexPage: FC = observer(function IndexPage_() {
  const pagesStore = usePagesStore();

  useEffect(() => {
    let timeout = null;
    if (pagesStore.send.txHash) {
      timeout = setTimeout(() => {
        pagesStore.send.resetTxHash();
      }, TX_RESULT_TIMEOUT);
    }
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [pagesStore.send.txHash]);

  return (
    <PageLayout
      isHeaderBordered
      title={
        <div className={styles.accountInfo}>
          <AccountInfo hasLink />
        </div>
      }
    >
      <div className={styles.root}>
        <WalletMain />
        {pagesStore.send.txHash && (
          <div className={styles.snackbar} style={{ bottom: IS_PLUGIN ? 58 : 28 }}>
            <Snackbar
              label="Transaction Sent > View in Explorer"
              icon={<OpenInNew />}
              onClick={() =>
                window.open([TRANSACTION_EXPLORER_URL, pagesStore.send.txHash].join('#'))
              }
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
});
