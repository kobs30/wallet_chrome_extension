import { observer } from 'mobx-react-lite';

import { PageLayout } from 'layouts';
import { AccountInfo, Accounts } from 'views';

import styles from './Accounts.module.scss';

export const AccountsPage = observer(function AccountsPage_() {
  return (
    <PageLayout
      back="/"
      isHeaderBordered
      title={
        <div className={styles.accountInfo}>
          <AccountInfo hasLink />
        </div>
      }
    >
      <Accounts />
    </PageLayout>
  );
});
