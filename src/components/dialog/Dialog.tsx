import React, { forwardRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import clsx from 'clsx';

export const QueueDialogRoot = ({ children, ...props }: Dialog.DialogProps) => {
  return <Dialog.Root {...props}>{children}</Dialog.Root>;
};

export const QueueDialogTrigger = forwardRef<
  HTMLButtonElement,
  Dialog.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  return (
    <Dialog.Trigger ref={ref} {...props}>
      {children}
    </Dialog.Trigger>
  );
});

export const QueueDialogPortal = ({ children, ...props }: Dialog.DialogPortalProps) => {
  return <Dialog.Portal {...props}>{children}</Dialog.Portal>;
};

export const QueueDialogOverlay = forwardRef<
  HTMLDivElement,
  Dialog.DialogOverlayProps & React.RefAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Overlay ref={ref} {...props} className={clsx(styles.DialogOverlay, className)}>
      {children}
    </Dialog.Overlay>
  );
});

export const QueueDialogContent = forwardRef<
  HTMLDivElement,
  Dialog.DialogContentProps & React.RefAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Content ref={ref} {...props} className={clsx(styles.DialogContent, className)}>
      {children}
    </Dialog.Content>
  );
});

export const QueueDialogTitle = forwardRef<
  HTMLHeadingElement,
  Dialog.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Title ref={ref} {...props} className={clsx(styles.DialogTitle, className)}>
      {children}
    </Dialog.Title>
  );
});

export const QueueDialogDescription = forwardRef<
  HTMLParagraphElement,
  Dialog.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>
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
  QueueDialogFooterProps & React.RefAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(styles.DialogFooter, className)}>
      {children}
    </div>
  );
});

export const QueueDialogClose = forwardRef<
  HTMLButtonElement,
  Dialog.DialogCloseProps & React.RefAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  return (
    <Dialog.Close ref={ref} {...props}>
      {children}
    </Dialog.Close>
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
