import { FC } from 'react';
import cn from 'classnames';

import { NativeProps } from '../types';
import styles from './Chip.module.scss';
import { CloseSmallRounded } from '../icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';

export enum ChipSize {
  SMALL = 'sizeSmall',
  MEDIUM = 'sizeMedium',
}

export type ChipProps = {
  label: string;
  size?: ChipSize;
  displayGradientBorder?: boolean;
  disabled?: boolean;
  onClick?(): void;
  onDelete?(): void;
} & NativeProps;

export const Chip: FC<ChipProps> = (props) => {
  const {
    size = ChipSize.MEDIUM,
    displayGradientBorder,
    label,
    className,
    disabled,
    onClick,
    onDelete,
    ...restProps
  } = props;
  return (
    <div
      className={cn(
        styles.root,
        className,
        styles[size],
        disabled && styles.disabled,
        displayGradientBorder && styles.withGradientBorder,
        onClick && styles.clickable,
        onDelete && styles.withDelete
      )}
      {...restProps}
    >
      <div className={styles.border}>
        <div className={styles.content}>
          <span className={styles.label}>{label}</span>
          {onDelete && (
            <div className={styles.deleteButton} role="button" onClick={onDelete}>
              <Tooltip offset={1} placement="top">
                <TooltipTrigger>
                  <CloseSmallRounded width={18} height={18} />
                </TooltipTrigger>
                <TooltipContent>Forget Account</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
