import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { ImportAccount } from 'views';

import styles from './ImportAccountPage.module.scss';

export const ImportAccountPage: FC = () => {
  const navigate = useNavigate();
  const back = '/accounts';
  return (
    <PageLayout title="Import Account" back={back}>
      <div className={styles.root}>
        <ImportAccount onSubmitSuccess={() => navigate(back)} />
      </div>
    </PageLayout>
  );
};
