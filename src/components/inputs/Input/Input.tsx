import RcInput, { InputRef, InputProps as RcInputProps } from 'rc-input';
import { ChangeEventHandler, FocusEventHandler, forwardRef, ReactNode, useState } from 'react';
import cn from 'classnames';

import styles from './Input.module.scss';
import { NativeProps } from '../../types';
import { CloseRounded } from '../../icons';

export enum InputSize {
  SMALL = 'sizeSmall',
  MEDIUM = 'sizeMedium',
}

export type InputProps = RcInputProps & {
  size?: InputSize;
  legend?: string;
  textAfterCaret?: ReactNode; // Use with suffix & without prefix!
} & NativeProps;

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    size = InputSize.MEDIUM,
    legend,
    className,
    textAfterCaret,
    onFocus,
    onBlur,
    onChange,
    allowClear,
    ...restProps
  } = props;

  const [value, setValue] = useState(restProps.value?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  const mergedAllowClear =
    allowClear === true
      ? {
          clearIcon: (
            <div role="button" className={styles.inputButton}>
              <CloseRounded className={styles.inputIcon} />
            </div>
          ),
        }
      : allowClear;

  return (
    <div
      className={cn(
        styles.root,
        className,
        styles[size],
        restProps.type && styles[restProps.type],
        {
          [styles.disabled]: restProps.disabled,
          [styles.focused]: isFocused,
          [styles.withTextAfterCaret]: !!textAfterCaret && restProps.type !== 'password',
        }
      )}
    >
      {legend && <div className={styles.legend}>{legend}</div>}
      <RcInput
        ref={ref}
        {...restProps}
        allowClear={mergedAllowClear}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={styles.rcInput}
      />
      {textAfterCaret && value.length !== 0 && restProps.type !== 'password' && (
        <div className={styles.hiddenArea}>
          <span className={styles.hiddenAreaText}>{value}</span>
          <div className={styles.textAfterCaret}>{textAfterCaret}</div>
        </div>
      )}
    </div>
  );
});
