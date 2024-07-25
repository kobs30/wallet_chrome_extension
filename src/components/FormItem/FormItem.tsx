import { FC, ReactNode } from 'react';
import cn from 'classnames';

import { InfoCircle, QuestionCircle } from '../icons';
import styles from './FormItem.module.scss';

export type FormItemProps = {
  info?: string;
  warning?: string | undefined;
  noIcon?: boolean;
  children: ReactNode;
};

export const FormItem: FC<FormItemProps> = (props) => {
  const { info, warning, noIcon, children } = props;

  const getIcon = () => {
    if (noIcon) return;
    if (warning) return <InfoCircle className={styles.footerIcon} />;
    if (info) return <QuestionCircle className={styles.footerIcon} />;
  };

  return (
    <div className={styles.root}>
      {children}
      <div className={cn(styles.footer, { [styles.warning]: !!warning, [styles.noIcon]: noIcon })}>
        <div className={styles.footerInner}>
          {getIcon()}
          <span className={styles.footerText}>{warning || info}</span>
        </div>
      </div>
    </div>
  );
};
