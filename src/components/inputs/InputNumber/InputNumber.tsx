import { InputProps as RcInputProps } from 'rc-input';
import RcInputNumber, { InputNumberProps as RcInputNumberProps, ValueType } from 'rc-input-number';
import { forwardRef, useRef, useState } from 'react';
import cn from 'classnames';

import { composeRef } from 'utils/ref';

import styles from './InputNumber.module.scss';
import { NativeProps } from '../../types';

export enum InputNumberSize {
  SMALL = 'sizeSmall',
  MEDIUM = 'sizeMedium',
}

export type InputNumberProps = Omit<RcInputNumberProps, 'size'> &
  Pick<RcInputProps, 'prefix' | 'suffix'> & {
    noEditable?: boolean;
    size?: InputNumberSize;
    legend?: string;
  } & NativeProps<'--height' | '--font-weight'>;

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  props,
  ref
) {
  const {
    noEditable,
    size = InputNumberSize.MEDIUM,
    legend,
    prefix,
    suffix,
    className,
    style,
    ...restProps
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value: ValueType | null) => {
    restProps.onChange?.(value);
  };

  return (
    <div
      style={style}
      className={cn(styles.root, className, styles[size], {
        [styles.noEditable]: noEditable,
        [styles.focused]: isFocused,
        [styles.disabled]: restProps.disabled,
        [styles.withSuffix]: !!suffix,
        [styles.withPrefix]: !!prefix,
      })}
      onMouseUp={() => inputRef.current?.focus()}
    >
      {prefix && <div className={styles.prefix}>{prefix}</div>}
      {legend && <div className={styles.legend}>{legend}</div>}
      <RcInputNumber
        {...restProps}
        ref={composeRef(ref, inputRef)}
        inputMode="numeric"
        controls={false}
        onChange={handleChange}
        onFocus={(e) => {
          if (noEditable) {
            e.preventDefault();
          }
          setIsFocused(true);
          restProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          restProps.onBlur?.(e);
        }}
      />
      {suffix && <div className={styles.suffix}>{suffix}</div>}
    </div>
  );
});
