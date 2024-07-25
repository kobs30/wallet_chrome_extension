import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  MouseEventHandler,
  ReactNode,
} from 'react';
import cn from 'classnames';

import styles from './Button.module.scss';
import { NativeProps } from '../types';

export enum ButtonColor {
  PRIMARY = 'colorPrimary',
}

export enum ButtonVariant {
  CONTAINED = 'variantContained',
  SECONDARY = 'variantSecondary',
}

export enum ButtonSize {
  SMALL = 'sizeSmall',
  MEDIUM = 'sizeMedium',
}

export enum ButtonShape {
  DEFAULT = 'shapeDefault',
  CIRCLE = 'shapeCircle',
}

export type BaseButtonProps = {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;

  disabled?: boolean;
  fullWidth?: boolean;

  children?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;

  [key: `data-${string}`]: string;
};

export type AnchorButtonProps = {
  href?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement | HTMLButtonElement>, 'type' | 'onClick'>;

export type NativeButtonProps = {
  htmlType?: 'button' | 'submit';
  htmlForm?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps> &
  NativeProps<'--color' | '--size'>;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      color = ButtonColor.PRIMARY,
      size = ButtonSize.MEDIUM,
      variant = ButtonVariant.CONTAINED,
      shape = ButtonShape.DEFAULT,
      fullWidth,
      startIcon,
      endIcon,
      children,
      disabled,
      href,
      target,
      rel,
      onClick,
      htmlType = 'button',
      htmlForm,
      className,
      ...restProps
    } = props;

    const classNames = cn(
      styles.root,
      styles[color],
      styles[variant],
      styles[size],
      styles[shape],
      {
        [styles.fullWidth]: fullWidth,
        [styles.iconOnly]: !children && children !== 0,
        [styles.withStartIcon]: !!startIcon,
        [styles.withEndIcon]: !!endIcon,
        [styles.disabled]: disabled,
      },
      className
    );

    const childrenToRender = (
      <span className={styles.inner}>
        {!endIcon && startIcon}
        {children && <span>{children}</span>}
        {!startIcon && endIcon}
      </span>
    );

    if (typeof href !== 'undefined') {
      const anchorProps = {
        ref: ref as ForwardedRef<HTMLAnchorElement>,
        href: href,
        onClick: onClick,
        target: target,
        className: classNames,
        rel: rel,
        style: restProps.style,
      };

      return <a {...anchorProps}>{childrenToRender}</a>;
    }

    return (
      <button
        {...restProps}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={htmlType}
        form={htmlForm}
        disabled={disabled}
        className={classNames}
        onClick={onClick}
      >
        {childrenToRender}
      </button>
    );
  }
);
