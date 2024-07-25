import { Link } from 'react-router-dom';
import { cloneElement, FC, ReactElement } from 'react';
import cn from 'classnames';

import { KeyboardArrowRight } from 'components/icons';

import styles from './SettingsLink.module.scss';
import { PrefixRect } from '../../../components';

export type SettingsLinkProps = {
  icon: ReactElement;
  pathname: string;
  title: string;
  description: string;
  disabled?: boolean;
};

const ICON_SIZE = 18;

export const SettingsLink: FC<SettingsLinkProps> = (props) => {
  const { pathname, icon, description, title, disabled } = props;
  return (
    <Link to={pathname} className={cn(styles.root, disabled && styles.disabled)}>
      <PrefixRect className={styles.icon}>
        {cloneElement(icon, { width: ICON_SIZE, height: ICON_SIZE })}
      </PrefixRect>
      <div className={styles.content}>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
        <KeyboardArrowRight width={ICON_SIZE} height={ICON_SIZE} className={styles.arrowIcon} />
      </div>
    </Link>
  );
};
