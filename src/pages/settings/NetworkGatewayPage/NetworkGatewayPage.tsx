import { FC } from 'react';

import { PageLayout } from 'layouts';
import { NetworkGateway } from 'views';

import styles from './NetworkGateway.module.scss';

export const NetworkGatewayPage: FC = () => {
  return (
    <PageLayout back="/settings" title="Network Gateway">
      <div className={styles.root}>
        <NetworkGateway />
      </div>
    </PageLayout>
  );
};
