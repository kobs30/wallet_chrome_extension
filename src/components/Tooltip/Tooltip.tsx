import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useMergeRefs,
  useTransitionStyles,
  useDelayGroup,
  useClick,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';
import { FC, forwardRef } from 'react';

import moduleStyles from './Tooltip.module.scss';

export type TooltipProps = {
  placement?: Placement;
  offset?: number;
  clickOnly?: boolean;

  // controlled
  open?: boolean;
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  offset: propOffset = 0,
  clickOnly,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(propOffset), flip(), shift()],
  });

  const { context } = data;

  const { delay } = useDelayGroup(context);

  const click = useClick(context, {
    enabled: !!clickOnly,
  });
  const hover = useHover(context, {
    move: false,
    enabled: !clickOnly,
    delay,
  });
  const focus = useFocus(context, {
    enabled: !clickOnly,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([click, hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipState = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

export const Tooltip: FC<{ children: React.ReactNode } & TooltipProps> = ({
  children,
  ...restProps
}) => {
  const tooltip = useTooltip(restProps);
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
};

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const state = useTooltipState();

  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([state.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      state.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': state.open ? 'open' : 'closed',
      })
    );
  }

  return (
    <div
      ref={ref}
      style={{ display: 'flex' }}
      data-state={state.open ? 'open' : 'closed'}
      {...state.getReferenceProps(props)}
    >
      {children}
    </div>
  );
});

export const TooltipContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, propRef) => {
    const state = useTooltipState();
    const ref = useMergeRefs([state.refs.setFloating, propRef]);
    const { isInstantPhase, currentId } = useDelayGroup(state.context);

    useDelayGroup(state.context, { id: state.context.floatingId });

    const instantDuration = 0;
    const duration = 200;

    const { isMounted, styles } = useTransitionStyles(state.context, {
      duration: isInstantPhase
        ? {
            open: instantDuration,
            close: currentId === state.context.floatingId ? duration : instantDuration,
          }
        : duration,
      initial: {
        opacity: 0,
      },
    });

    if (!isMounted) return null;

    return (
      <FloatingPortal>
        <div
          className={moduleStyles.root}
          ref={ref}
          style={{
            ...state.floatingStyles,
            ...props.style,
            ...styles,
          }}
          {...state.getFloatingProps(props)}
        />
      </FloatingPortal>
    );
  }
);
