import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { AccountDetails } from 'views';

import styles from './AccountDetailsPage.module.scss';

export const AccountDetailsPage: FC = () => {
  const navigate = useNavigate();
  return (
    <PageLayout title="Account Details & Key" back={() => navigate(-1)}>
      <div className={styles.root}>
        <AccountDetails />
      </div>
    </PageLayout>
  );
};
