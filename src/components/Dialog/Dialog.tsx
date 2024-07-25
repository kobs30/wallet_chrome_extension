import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
} from '@floating-ui/react';
import {
  cloneElement,
  createContext,
  FC,
  forwardRef,
  HTMLProps,
  isValidElement,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import styles from './Dialog.module.scss';
import { CloseRounded } from '../icons';

export type DialogProps = {
  // controlled
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const useDialog = ({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const click = useClick(data.context);
  const dismiss = useDismiss(data.context, { outsidePressEvent: 'mousedown' });
  const role = useRole(data.context);

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  );
};

type ContextType = ReturnType<typeof useDialog> | null;

const DialogContext = createContext<ContextType>(null);

export const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog components must be wrapped in <Dialog />');
  }

  return context;
};

export const Dialog: FC<DialogProps & { children: ReactNode }> = ({ children, ...restProps }) => {
  const dialog = useDialog(restProps);
  return <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>;
};

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = forwardRef<HTMLElement, HTMLProps<HTMLElement> & DialogTriggerProps>(
  ({ children, asChild = false, ...restProps }, propRef) => {
    const context = useDialogContext();
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...restProps,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        })
      );
    }

    return (
      <button
        ref={ref}
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(restProps)}
      >
        {children}
      </button>
    );
  }
);

export const DialogContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  function DialogContent(props, propRef) {
    const { context: floatingContext, ...rest } = useDialogContext();
    const ref = useMergeRefs([rest.refs.setFloating, propRef]);

    if (!floatingContext.open) return null;

    return (
      <FloatingPortal>
        <FloatingOverlay className={styles.overlay} lockScroll>
          <FloatingFocusManager context={floatingContext}>
            <>
              <div className={styles.background} />
              <div ref={ref} {...rest.getFloatingProps(props)} className={styles.dialog}>
                {props.children}
              </div>
            </>
          </FloatingFocusManager>
        </FloatingOverlay>
      </FloatingPortal>
    );
  }
);

const CLOSE_ICON_SIZE = 18;

export const DialogHeading = forwardRef<HTMLButtonElement, { title: string }>((props, ref) => {
  const { title } = props;
  const { setOpen } = useDialogContext();
  return (
    <div className={styles.heading}>
      <span className={styles.title}>{title}</span>
      <button type="button" ref={ref} onClick={() => setOpen(false)} className={styles.closeButton}>
        <CloseRounded width={CLOSE_ICON_SIZE} height={CLOSE_ICON_SIZE} />
      </button>
    </div>
  );
});
