import { FC } from 'react';

import styles from './SelectNativeListItem.module.scss';

export type SelectNativeListItemProps = {
  balance: number;
};

const ICON_SIZE = 20;

export const SelectNativeListItem: FC<SelectNativeListItemProps> = (props) => {
  const { balance } = props;

  return (
    <div className={styles.root}>
      <img src="assets/images/tokens/cycl.png" width={ICON_SIZE} height={ICON_SIZE} />
      <div className={styles.content}>
        <span className={styles.title}>CYCL</span>
        <span className={styles.balance}>{balance.toFixed(2)}</span>
      </div>
    </div>
  );
};
