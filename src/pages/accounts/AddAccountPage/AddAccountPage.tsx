import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { AddAccount } from 'views';

import styles from './AddAccountPage.module.scss';

export const AddAccountPage: FC = () => {
  const navigate = useNavigate();
  const back = '/accounts';
  return (
    <PageLayout back={back} title="Add Account">
      <div className={styles.root}>
        <AddAccount onSubmitSuccess={() => navigate(back)} />
      </div>
    </PageLayout>
  );
};
