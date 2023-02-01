import React, { forwardRef } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import clsx from 'clsx';
import styles from './AlertDialog.module.scss';
import { QueueButtonProps } from 'components/button/Button';

export const QueueAlertDialogRoot: React.FC<AlertDialog.AlertDialogProps> = ({
  children,
  ...props
}) => {
  return (
    <AlertDialog.Root {...props}>
      {children}
    </AlertDialog.Root>
  );
};

export const QueueAlertDialogTrigger: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <AlertDialog.Trigger
      ref={ref}
      {...props}
      className={clsx(
        className,
      )}
    >
      {children}
    </AlertDialog.Trigger>
  );
});

export const QueueAlertDialogPortal: React.FC<AlertDialog.AlertDialogPortalProps> = ({
  children,
  ...props
}) => {
  return (
    <AlertDialog.Portal {...props}>
      {children}
    </AlertDialog.Portal>
  );
};

export const QueueAlertDialogOverlay: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogOverlayProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <AlertDialog.Overlay
      ref={ref}
      {...props}
      className={clsx(
        styles.AlertDialogOverlay,
        className,
      )}
    >
      {children}
    </AlertDialog.Overlay>
  );
});

export const QueueAlertDialogContent: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <AlertDialog.Content
      ref={ref}
      {...props}
      className={clsx(
        styles.AlertDialogContent,
        className,
      )}
    >
      {children}
    </AlertDialog.Content>
  );
});

export const QueueAlertDialogAction: React.ForwardRefExoticComponent<
  QueueButtonProps & AlertDialog.AlertDialogActionProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({
  children,
  className,
  round = false,
  size = 'medium',
  color = 'default',
  ...props
}, ref) => {
  return (
    <AlertDialog.Action
      ref={ref}
      {...props}
      className={clsx(
        styles.AlertDialogAction,
        className,
        styles[size],
        styles[color],
        round ? styles.round : null,
      )}
    >
      {children}
    </AlertDialog.Action>
  );
});

export const QueueAlertDialogCancel: React.ForwardRefExoticComponent<
  QueueButtonProps & AlertDialog.AlertDialogCancelProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({
  children,
  className,
  round = false,
  size = 'medium',
  color = 'default',
  ...props
}, ref) => {
  return (
    <AlertDialog.Cancel
      ref={ref}
      {...props}
      className={clsx(
        styles.AlertDialogCancel,
        className,
        styles[size],
        styles[color],
        round ? styles.round : null,
      )}
    >
      {children}
    </AlertDialog.Cancel>
  );
});

export const QueueAlertDialogTitle: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogTitleProps & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <AlertDialog.Title
      ref={ref}
      {...props}
      className={clsx(
        styles.AlertDialogTitle,
        className,
      )}
    >
      {children}
    </AlertDialog.Title>
  );
});

export const QueueAlertDialogDescription: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <AlertDialog.Description
      ref={ref}
      {...props}
      className={clsx(
        styles.AlertDialogDescription,
        className,
      )}
    >
      {children}
    </AlertDialog.Description>
  );
});

export interface QueueAlertDialogFooterProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const QueueAlertDialogFooter: React.ForwardRefExoticComponent<
  QueueAlertDialogFooterProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx(
        styles.AlertDialogFooter,
        className,
      )}
    >
      {children}
    </div>
  );
});

export const QueueAlertDialog = {
  Root: QueueAlertDialogRoot,
  Trigger: QueueAlertDialogTrigger,
  Portal: QueueAlertDialogPortal,
  Overlay: QueueAlertDialogOverlay,
  Content: QueueAlertDialogContent,
  Action: QueueAlertDialogAction,
  Cancel: QueueAlertDialogCancel,
  Title: QueueAlertDialogTitle,
  Description: QueueAlertDialogDescription,
  Footer: QueueAlertDialogFooter,
};
