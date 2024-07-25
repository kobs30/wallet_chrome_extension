import { FC } from 'react';

import { PageLayout } from 'layouts';
import { ResetCache } from 'views';

import styles from './ResetCachePage.module.scss';

export const ResetCachePage: FC = () => {
  return (
    <PageLayout back="/welcome-back" title="Reset Cache!">
      <div className={styles.root}>
        <ResetCache />
      </div>
    </PageLayout>
  );
};
