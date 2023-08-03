import React, { forwardRef, useImperativeHandle } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import clsx from 'clsx';
import { useRootRenderedContext } from 'cdk/root-renderer/root-renderer';

export interface QueueDialogRootProps {
  children?: React.ReactNode;
}

export interface QueueDialogRootRef {
  close: () => void;
}

export const QueueDialogRoot = forwardRef<
  QueueDialogRootRef,
  QueueDialogRootProps
>(({ children }, ref) => {
  const rendered = useRootRenderedContext();

  useImperativeHandle(ref, () => {
    return {
      close: (): void => {
        rendered.close();
      },
    };
  }, [rendered]);

  return (
    <Dialog.Root
      open={true}
      defaultOpen={true}
      onOpenChange={(opened) => {
        !opened && rendered.close();
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
