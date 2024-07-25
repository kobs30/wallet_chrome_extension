import RcTabs, { TabsProps as RcTabsProps } from 'rc-tabs';
import cn from 'classnames';

import { NativeProps } from '../types';
import styles from './Tabs.module.scss';

export type TabsProps = RcTabsProps & NativeProps;

export function Tabs(props: TabsProps) {
  const { className, style, ...restProps } = props;
  return (
    <RcTabs className={cn(styles.root, className)} style={style} {...restProps} animated={false} />
  );
}
