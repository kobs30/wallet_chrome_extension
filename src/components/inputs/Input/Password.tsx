import { Attributes, cloneElement, forwardRef, HTMLAttributes, MouseEvent, useState } from 'react';
import { InputRef } from 'rc-input';

import { Tooltip, TooltipContent, TooltipTrigger } from 'components/index';

import { Input, InputProps } from './Input';
import { Eye, EyeClose } from '../../icons';
import styles from './Input.module.scss';

type IconPropsType = HTMLAttributes<HTMLSpanElement> & Attributes;

export const Password = forwardRef<InputRef, InputProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(() => false);

  const onVisibleChange = () => {
    if (props.disabled) return;

    setIsVisible((prevState) => {
      return !prevState;
    });
  };

  const icon = isVisible ? <EyeClose /> : <Eye />;
  const iconProps: IconPropsType = {
    key: 'pwdIcon',
    onClick: onVisibleChange,
    onMouseDown: (e: MouseEvent<HTMLSpanElement>) => {
      // Prevent focused state lost
      e.preventDefault();
    },
    onMouseUp: (e: MouseEvent<HTMLSpanElement>) => {
      // Prevent caret position change
      e.preventDefault();
    },
  };

  const suffixIcon = cloneElement<IconPropsType>(
    <span className={styles.inputButton}>
      <Tooltip>
        <TooltipTrigger>{icon}</TooltipTrigger>
        <TooltipContent>{isVisible ? 'Hide' : 'Show'}</TooltipContent>
      </Tooltip>
    </span>,
    iconProps
  );

  const inputProps: InputProps = {
    ...props,
    type: isVisible ? 'text' : 'password',
    suffix: suffixIcon,
  };

  return <Input ref={ref} {...inputProps} />;
});
