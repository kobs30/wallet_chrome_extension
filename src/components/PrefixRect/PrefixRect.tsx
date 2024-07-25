import { FC, MouseEventHandler, ReactNode } from 'react';
import cn from 'classnames';

import { Done } from '../icons';
import styles from './PrefixRect.module.scss';
import { NativeProps } from '../types';

export type ListItemPrefixProps = {
  isActive?: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
} & NativeProps;

const DONE_ICON_SIZE = 12;

export const PrefixRect: FC<ListItemPrefixProps> = (props) => {
  const { isActive, children, className, onClick, ...restProps } = props;
  return (
    <div
      className={cn(
        styles.root,
        className,
        isActive && styles.active,
        onClick && styles.clickable,
        typeof isActive === 'undefined' && styles.noActive
      )}
      onClick={onClick}
      {...restProps}
    >
      {children}
      <div className={styles.state}>
        {isActive && <Done width={DONE_ICON_SIZE} height={DONE_ICON_SIZE} />}
      </div>
    </div>
  );
};
