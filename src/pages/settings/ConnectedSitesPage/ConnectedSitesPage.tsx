import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { ConnectedSites } from 'views/ConnectedSites/ConnectedSites';

import styles from './ConnectedSitesPage.module.scss';

export const ConnectedSitesPage: FC = () => {
  const navigate = useNavigate();
  return (
    <PageLayout back="/settings" title="Connected sites">
      <div className={styles.root}>
        <ConnectedSites onSubmitSuccess={() => navigate('/settings')} />
      </div>
    </PageLayout>
  );
};
