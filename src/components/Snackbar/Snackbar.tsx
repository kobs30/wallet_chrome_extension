import { cloneElement, FC, ReactElement } from 'react';
import cn from 'classnames';

import styles from './Snackbar.module.scss';

export type SnackbarProps = {
  label: string;
  icon?: ReactElement;
  onClick?(): void;
};

const ICON_SIZE = 16;

export const Snackbar: FC<SnackbarProps> = (props) => {
  const { label, icon, onClick } = props;
  return (
    <div className={cn(styles.root, onClick && styles.clickable)} onClick={onClick}>
      <span>{label}</span>
      {icon && (
        <div className={styles.icon}>
          {cloneElement(icon, {
            width: ICON_SIZE,
            height: ICON_SIZE,
          })}
        </div>
      )}
    </div>
  );
};
