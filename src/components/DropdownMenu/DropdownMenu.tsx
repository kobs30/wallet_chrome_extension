import { cloneElement, forwardRef, ReactElement } from 'react';
import cn from 'classnames';

import styles from './DropdownMenu.module.scss';

export type DropdownMenuListItem =
  | {
      icon: ReactElement;
      iconSize?: number;
      label: string;
      divider?: false;
      disabled?: boolean;
      onClick(): void;
    }
  | {
      icon?: never;
      iconSize?: never;
      label?: never;
      onClick?: never;
      disabled?: never;
      divider: true;
    };

export type DropdownMenuProps = {
  list: DropdownMenuListItem[];
};

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>((props, ref) => {
  const { list } = props;
  return (
    <div ref={ref} className={styles.root}>
      <ul className={styles.list}>
        {list.map((item, index) => {
          const { icon, disabled, iconSize = 18, label, onClick, divider } = item;

          if (divider) {
            return <li className={styles.divider} key={index} />;
          }

          return (
            <li
              className={cn(styles.li, disabled && styles.disabled)}
              key={index}
              onClick={onClick}
            >
              <div className={styles.iconWrapper}>
                {cloneElement(icon, { width: iconSize, height: iconSize })}
              </div>
              <span className={styles.label}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
