import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { ArrowBackLong } from 'components/icons';
import { Overlay } from 'components';

import styles from './PageLayout.module.scss';

export type PageLayoutProps = {
  back?: string | (() => void);
  title?: ReactNode;
  children: ReactNode;
  isHeaderFixed?: boolean;
  isHeaderBordered?: boolean;
  isHeaderOverlayActive?: boolean;
};

export const PageLayout: FC<PageLayoutProps> = (props) => {
  const {
    children,
    back,
    title,
    isHeaderFixed,
    isHeaderBordered,
    isHeaderOverlayActive = false,
  } = props;

  const renderBackButton = () => {
    if (!back) return;

    if (typeof back === 'string') {
      return (
        <Link to={back} className={styles.headerIconWrapper}>
          <ArrowBackLong className={styles.headerIcon} />
        </Link>
      );
    }

    return (
      <div className={styles.headerIconWrapper} onClick={back}>
        <ArrowBackLong className={styles.headerIcon} />
      </div>
    );
  };

  return (
    <div
      className={cn(styles.root, {
        [styles.headerBordered]: isHeaderBordered,
        [styles.headerFixed]: isHeaderFixed,
      })}
    >
      <Overlay isActive={isHeaderOverlayActive}>
        <div className={styles.header}>
          {renderBackButton()}
          <span className={styles.headerTitle}>{title}</span>
        </div>
      </Overlay>
      {children}
    </div>
  );
};
