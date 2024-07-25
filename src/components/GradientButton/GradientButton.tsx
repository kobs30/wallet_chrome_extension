import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './GradientButton.module.scss';
import { NativeProps } from '../types';

export type GradientButtonProps = {
  id?: string;
  isActive?: boolean;
  children: ReactNode;
} & NativeProps;

export const GradientButton: FC<GradientButtonProps> = (props) => {
  const { id, isActive, children, className, ...restProps } = props;
  return (
    <div id={id} className={cn(styles.root, className, isActive && styles.active)} {...restProps}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};
