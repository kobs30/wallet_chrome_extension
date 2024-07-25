import { cloneElement, FC, ReactElement } from 'react';
import cn from 'classnames';

import { UnpinOutlined } from 'components/icons';

import styles from './BottomNavigation.module.scss';

export type BottomNavigationTab = {
  label: string;
  value: string;
  icon: ReactElement;
  onClick?(): void;
};

export type BottomNavigationProps = {
  activeTab: string;
  tabs: BottomNavigationTab[];
};

const ICON_SIZE = 19;

export const BottomNavigation: FC<BottomNavigationProps> = (props) => {
  const { tabs, activeTab } = props;
  return (
    <div className={styles.root}>
      {tabs.map((t, index) => (
        <div
          onClick={t.onClick}
          className={cn(styles.tab, activeTab === t.value && styles.active)}
          key={index}
        >
          {cloneElement(t.icon, {
            width: ICON_SIZE,
            height: ICON_SIZE,
          })}
          {t.label}
        </div>
      ))}
      <div
        style={{ opacity: 0.2, pointerEvents: 'none' }} // TODO: MOCK
        className={styles.unpinButton}
        role="button"
        onClick={() => chrome.runtime.sendMessage('open')}
      >
        <UnpinOutlined width={12} height={12} />
      </div>
    </div>
  );
};
