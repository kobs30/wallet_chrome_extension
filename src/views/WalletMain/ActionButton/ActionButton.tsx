import { cloneElement, forwardRef, ReactElement } from 'react';
import cn from 'classnames';

import styles from './ActionButton.module.scss';

export type ActionButtonProps = {
  label: string;
  icon: ReactElement;
  disabled?: boolean;
  onClick?(): void;
};

export const ActionButton = forwardRef<HTMLDivElement, ActionButtonProps>((props, ref) => {
  const { label, icon, disabled, onClick } = props;
  return (
    <div className={cn(styles.root, disabled && styles.disabled)}>
      <div className={styles.button} role="button" ref={ref} onClick={onClick}>
        {cloneElement(icon, {
          width: 19,
          height: 19,
          className: styles.icon,
        })}
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
});
