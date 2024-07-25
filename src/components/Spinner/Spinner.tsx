import { FC } from 'react';

import { Loading } from '../icons/brand';
import styles from './Spinner.module.scss';

export type SpinnerProps = {
  size?: number;
};

export const Spinner: FC<SpinnerProps> = (props) => {
  const { size = 32 } = props;
  return (
    <div className={styles.root}>
      <Loading width={size} height={size} />
    </div>
  );
};
