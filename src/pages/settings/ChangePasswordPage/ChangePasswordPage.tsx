import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { ChangePassword } from 'views';

import styles from './ChangePasswordPage.module.scss';

export const ChangePasswordPage: FC = () => {
  const navigate = useNavigate();
  return (
    <PageLayout back="/settings" title="Change password">
      <div className={styles.root}>
        <ChangePassword onSubmitSuccess={() => navigate('/settings')} />
      </div>
    </PageLayout>
  );
};
