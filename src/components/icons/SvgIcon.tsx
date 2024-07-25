import { memo, forwardRef, Ref, ReactNode, CSSProperties } from 'react';

export type SvgIconProps = {
  width?: number;
  height?: number;
  viewBox?: string;
  children?: ReactNode;
  shapeRendering?: string;
  className?: string;
  style?: CSSProperties;
  titleAccess?: string;
};

const DEFAULT_SIZE = 24;

export const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  const {
    viewBox = `0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`,
    width = DEFAULT_SIZE,
    height = DEFAULT_SIZE,
    className,
    style,
    titleAccess,
    children,
    ...restProps
  } = props;
  return (
    <svg
      ref={ref}
      {...restProps}
      style={style}
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      focusable="false"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={titleAccess ? undefined : true}
      role={titleAccess ? 'img' : undefined}
    >
      {children}
      {titleAccess ? <title>{titleAccess}</title> : null}
    </svg>
  );
});

export function createSvgIcon(path: ReactNode) {
  function Component(props: SvgIconProps, ref: Ref<SVGSVGElement>) {
    return (
      <SvgIcon ref={ref} {...props}>
        {path}
      </SvgIcon>
    );
  }

  return memo(forwardRef(Component));
}
