import React, { forwardRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import clsx from 'clsx';

export const QueueDialogRoot: React.FC<Dialog.DialogProps> = ({ children, ...props }) => {
  return <Dialog.Root {...props}>{children}</Dialog.Root>;
};

export const QueueDialogTrigger: React.ForwardRefExoticComponent<
  Dialog.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(({ children, ...props }, ref) => {
  return (
    <Dialog.Trigger ref={ref} {...props}>
      {children}
    </Dialog.Trigger>
  );
});

export const QueueDialogPortal: React.FC<Dialog.DialogPortalProps> = ({ children, ...props }) => {
  return <Dialog.Portal {...props}>{children}</Dialog.Portal>;
};

export const QueueDialogOverlay: React.ForwardRefExoticComponent<
  Dialog.DialogOverlayProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Overlay ref={ref} {...props} className={clsx(styles.DialogOverlay, className)}>
      {children}
    </Dialog.Overlay>
  );
});

export const QueueDialogContent: React.ForwardRefExoticComponent<
  Dialog.DialogContentProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Content ref={ref} {...props} className={clsx(styles.DialogContent, className)}>
      {children}
    </Dialog.Content>
  );
});

export const QueueDialogTitle: React.ForwardRefExoticComponent<
  Dialog.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>
> = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Title ref={ref} {...props} className={clsx(styles.DialogTitle, className)}>
      {children}
    </Dialog.Title>
  );
});

export const QueueDialogDescription: React.ForwardRefExoticComponent<
  Dialog.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>
> = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Dialog.Description ref={ref} {...props} className={clsx(styles.DialogDescription, className)}>
      {children}
    </Dialog.Description>
  );
});

export interface QueueDialogFooterProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const QueueDialogFooter: React.ForwardRefExoticComponent<
  QueueDialogFooterProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(styles.DialogFooter, className)}>
      {children}
    </div>
  );
});

export const QueueDialogClose: React.ForwardRefExoticComponent<
  Dialog.DialogCloseProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(({ children, ...props }, ref) => {
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
