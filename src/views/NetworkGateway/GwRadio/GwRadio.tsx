import { cloneElement, FC, ReactElement } from 'react';

import { PrefixRect } from 'components';

import styles from './GwRadio.module.scss';

export type GwRadioProps = {
  title: string;
  description: string;
  icon: ReactElement;
  isActive: boolean;
  onClick(): void;
};

const ICON_SIZE = 18;

export const GwRadio: FC<GwRadioProps> = (props) => {
  const { title, description, isActive, icon, onClick } = props;
  return (
    <div className={styles.root} onClick={onClick}>
      <PrefixRect isActive={isActive} className={styles.prefix}>
        {cloneElement(icon, { width: ICON_SIZE, height: ICON_SIZE })}
      </PrefixRect>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};
