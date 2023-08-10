import React, { forwardRef, useImperativeHandle } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import clsx from 'clsx';
import { useRootRenderedContext } from 'cdk/root-renderer/root-renderer';

export interface QueueDialogRootProps {
  /**
   * @description
   * 다이얼로그의 열림 여부를 지정합니다.
   * Radix DialogRoot 의 open 과 동일합니다.
   * RootRenderer 를 통해 사용하는 경우 지정할 필요가 없습니다.
   *
   * @default true
   */
  open?: boolean;

  /**
   * @description
   * 다이얼로그의 열림 여부를 지정합니다.
   * Radix DialogRoot 의 defaultOpen 과 동일합니다.
   * RootRenderer 를 통해 사용하는 경우 지정할 필요가 없습니다.
   *
   * @default true
   */
  defaultOpen?: boolean;

  /**
   * @description
   * 다이얼로그의 열림 여부가 변경될 때 호출되는 콜백입니다.
   * Radix DialogRoot 의 onOpenChange 와 동일합니다.
   */
  onOpenChange?: (opened: boolean) => void;

  children?: React.ReactNode;
}

export interface QueueDialogRootRef {
  /**
   * @description
   * 다이얼로그를 닫습니다.
   */
  close: () => void;
}

export const QueueDialogRoot = forwardRef<
  QueueDialogRootRef,
  QueueDialogRootProps
>(({ children, ...props }, ref) => {
  const context = useRootRenderedContext();

  useImperativeHandle(ref, () => {
    return {
      close: (): void => {
        context.close();
      },
    };
  }, [context]);

  return (
    <Dialog.Root
      open={props.open}
      defaultOpen={props.defaultOpen}
      onOpenChange={(opened) => {
        !opened && context.close();
        props.onOpenChange?.(opened);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={clsx(styles.DialogOverlay)}></Dialog.Overlay>
        <Dialog.Content className={clsx(styles.DialogContent)}>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

QueueDialogRoot.defaultProps = {
  open: true,
  defaultOpen: true,
};

export const QueueDialogTitle = forwardRef<
  HTMLHeadingElement,
  Dialog.DialogTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Title ref={ref} {...props} className={clsx(styles.DialogTitle, className)}>
      {children}
    </Dialog.Title>
  );
});

export const QueueDialogDescription = forwardRef<
  HTMLParagraphElement,
  Dialog.DialogDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(styles.DialogDescription, className)}>
      {children}
    </div>
  );
});

export interface QueueDialogFooterProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const QueueDialogFooter = forwardRef<
  HTMLDivElement,
  QueueDialogFooterProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(styles.DialogFooter, className)}>
      {children}
    </div>
  );
});

export const QueueDialog = {
  Root: QueueDialogRoot,
  Title: QueueDialogTitle,
  Description: QueueDialogDescription,
  Footer: QueueDialogFooter,
};
