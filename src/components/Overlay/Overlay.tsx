import { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Overlay.module.scss';

export type OverlayProps = {
  isActive: boolean;
  children?: ReactNode;
};

export const Overlay: FC<OverlayProps> = (props) => {
  const { isActive, children } = props;
  return <div className={cn(styles.root, isActive && styles.active)}>{children}</div>;
};
