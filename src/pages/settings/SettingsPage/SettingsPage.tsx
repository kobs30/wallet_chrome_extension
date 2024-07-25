import { FC } from 'react';

import { PageLayout } from 'layouts';
import { Settings } from 'views';

import styles from './SettingsPage.module.scss';

export const SettingsPage: FC = () => {
  return (
    <PageLayout back="/" title="Settings">
      <div className={styles.root}>
        <Settings />
      </div>
    </PageLayout>
  );
};
