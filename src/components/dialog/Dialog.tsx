import React, { forwardRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import clsx from 'clsx';

export interface QueueDialogNewRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const QueueDialogNewRoot = ({ children, ...props }: QueueDialogNewRootProps) => {
  return (
    <Dialog.Root
      open={props.open}
      defaultOpen={props.defaultOpen}
      onOpenChange={props.onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={clsx(styles.DialogOverlay)}></Dialog.Overlay>
        <Dialog.Content className={clsx(styles.DialogContent)}>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
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
    <Dialog.Description ref={ref} {...props} className={clsx(styles.DialogDescription, className)}>
      {children}
    </Dialog.Description>
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
  Root: QueueDialogNewRoot,
  Title: QueueDialogTitle,
  Description: QueueDialogDescription,
  Footer: QueueDialogFooter,
};
