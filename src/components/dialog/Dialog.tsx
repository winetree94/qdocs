import React, { forwardRef } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import clsx from 'clsx';

export const QueueDialogRoot = ({ children, ...props }: RadixDialog.DialogProps) => {
  return <RadixDialog.Root {...props}>{children}</RadixDialog.Root>;
};

export const QueueDialogTrigger = forwardRef<
  HTMLButtonElement,
  RadixDialog.DialogTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <RadixDialog.Trigger ref={ref} {...props}>
      {children}
    </RadixDialog.Trigger>
  );
});

export const QueueDialogPortal = ({ children, ...props }: RadixDialog.DialogPortalProps) => {
  return <RadixDialog.Portal {...props}>{children}</RadixDialog.Portal>;
};

export const QueueDialogOverlay = forwardRef<
  HTMLDivElement,
  RadixDialog.DialogOverlayProps
>(({ children, className, ...props }, ref) => {
  return (
    <RadixDialog.Overlay ref={ref} {...props} className={clsx(styles.DialogOverlay, className)}>
      {children}
    </RadixDialog.Overlay>
  );
});

export const QueueDialogContent = forwardRef<
  HTMLDivElement,
  RadixDialog.DialogContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <RadixDialog.Content ref={ref} {...props} className={clsx(styles.DialogContent, className)}>
      {children}
    </RadixDialog.Content>
  );
});

export const QueueDialogTitle = forwardRef<
  HTMLHeadingElement,
  RadixDialog.DialogTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <RadixDialog.Title ref={ref} {...props} className={clsx(styles.DialogTitle, className)}>
      {children}
    </RadixDialog.Title>
  );
});

export const QueueDialogDescription = forwardRef<
  HTMLParagraphElement,
  RadixDialog.DialogDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <RadixDialog.Description ref={ref} {...props} className={clsx(styles.DialogDescription, className)}>
      {children}
    </RadixDialog.Description>
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

export const QueueDialogClose = forwardRef<
  HTMLButtonElement,
  RadixDialog.DialogCloseProps
>(({ children, ...props }, ref) => {
  return (
    <RadixDialog.Close ref={ref} {...props}>
      {children}
    </RadixDialog.Close>
  );
});

export const QueueDialog = {
  Root: QueueDialogRoot,
  Trigger: QueueDialogTrigger,
  Portal: QueueDialogPortal,
  Overlay: QueueDialogOverlay,
  Content: QueueDialogContent,
  Title: QueueDialogTitle,
  Description: QueueDialogDescription,
  Footer: QueueDialogFooter,
  Close: QueueDialogClose,
};
