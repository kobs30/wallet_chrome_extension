import { FC, ReactNode, useRef, useState } from 'react';
import {
  Placement,
  ReferenceType,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  FloatingArrow,
  arrow,
  useRole,
  shift,
  flip,
  FloatingPortal,
  autoUpdate,
  hide,
} from '@floating-ui/react';
import { inline, offset } from '@floating-ui/react-dom';

export type OpenerRenderProps = Record<string, unknown> & {
  ref: (node: ReferenceType | null) => void;
};

export type DropdownProps = {
  children: ReactNode;
  placement?: Placement;
  inline?: boolean;
  arrow?: boolean;
  offset?: number;
  fullWidth?: boolean;
  openerRender: (props: OpenerRenderProps, isOpened: boolean) => ReactNode;
  // controlled
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DEFAULT_ARROW_SIZE = 7;

export const Dropdown: FC<DropdownProps> = (props) => {
  const {
    fullWidth,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    children,
    placement,
    inline: propInline,
    arrow: propArrow,
    offset: propOffset = 0,
    openerRender,
  } = props;

  const arrowRef = useRef(null);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open,
    placement,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset((propArrow ? DEFAULT_ARROW_SIZE : 0) + propOffset),
      propInline ? inline() : undefined,
      flip(),
      shift(),
      propArrow ? arrow({ element: arrowRef }) : undefined,
      hide(),
    ],
  });

  const role = useRole(context);

  const click = useClick(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, focus, dismiss, role]);

  return (
    <>
      {openerRender({ ref: refs.setReference, ...getReferenceProps() }, open)}
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 10,
              visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
              maxWidth: 336,
              width: fullWidth ? '100%' : undefined,
              outline: 'none',
            }}
            {...getFloatingProps()}
          >
            {propArrow && <FloatingArrow ref={arrowRef} context={context} />}
            <div>{children}</div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
