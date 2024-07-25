import { cloneElement, FC, ReactElement } from 'react';
import cn from 'classnames';

import styles from './TwoColumnFooter.module.scss';

type Column = {
  label: string;
  icon: ReactElement;
  disabled?: boolean;
  onClick?(): void;
};

export type TwoColumnFooterProps = {
  leftColumn: Column;
  rightColumn?: Column;
};

export const TwoColumnFooter: FC<TwoColumnFooterProps> = (props) => {
  const { leftColumn, rightColumn } = props;

  const renderColumn = (column: Column, right?: boolean) => {
    return (
      <div
        onClick={column.onClick}
        className={cn(
          styles.column,
          column.onClick && styles.clickable,
          column.disabled && styles.disabled,
          right && styles.right
        )}
      >
        {cloneElement(column.icon, {
          width: 12,
          height: 12,
        })}
        <span>{column.label}</span>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      {renderColumn(leftColumn)}
      {rightColumn && renderColumn(rightColumn, true)}
    </div>
  );
};
