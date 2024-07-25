import { FocusEventHandler, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { BaseInputProps } from 'rc-input/lib/interface';
import RcTextArea, {
  TextAreaProps as RcTextAreaProps,
  TextAreaRef as RcTextAreaRef,
} from 'rc-textarea';
import cn from 'classnames';
import { InputFocusOptions } from 'rc-input/lib/utils/commonUtils';

import { CloseRounded } from '../../icons';
import styles from './TextArea.module.scss';
import { NativeProps } from '../../types';

export type TextAreaProps = Omit<RcTextAreaProps, 'suffix'> & {
  legend?: string;
} & NativeProps;

export interface TextAreaRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  resizableTextArea?: RcTextAreaRef['resizableTextArea'];
}

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  const { allowClear, legend, className, onFocus, onBlur, ...restProps } = props;

  const [isFocused, setIsFocused] = useState(false);

  const innerRef = useRef<RcTextAreaRef>(null);

  useImperativeHandle(ref, () => ({
    resizableTextArea: innerRef.current?.resizableTextArea,
    focus: () => {
      const textArea = innerRef.current?.resizableTextArea?.textArea;
      if (!textArea) return;
      textArea.focus();
    },
    blur: () => innerRef.current?.blur(),
  }));

  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  let mergedAllowClear: BaseInputProps['allowClear'];
  if (typeof allowClear === 'object' && allowClear?.clearIcon) {
    mergedAllowClear = allowClear;
  } else if (allowClear) {
    mergedAllowClear = {
      clearIcon: <CloseRounded />,
    };
  }

  return (
    <div className={cn(styles.root, isFocused && styles.focused)}>
      {legend && <div className={styles.legend}>{legend}</div>}
      <RcTextArea
        {...restProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={innerRef}
        allowClear={mergedAllowClear}
        className={cn(styles.textarea, className)}
      />
    </div>
  );
});
