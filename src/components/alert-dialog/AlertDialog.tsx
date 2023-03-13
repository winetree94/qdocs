import React, { forwardRef } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import clsx from 'clsx';
import styles from './AlertDialog.module.scss';
import { QueueButtonProps } from 'components/button/Button';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';

export const QueueAlertDialogRoot: React.FC<AlertDialog.AlertDialogProps> = ({ children, ...props }) => {
  return <AlertDialog.Root {...props}>{children}</AlertDialog.Root>;
};

export const QueueAlertDialogTrigger: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Trigger ref={ref} {...props} className={clsx(className)}>
      {children}
    </AlertDialog.Trigger>
  );
});

export const QueueAlertDialogPortal: React.FC<AlertDialog.AlertDialogPortalProps> = ({ children, ...props }) => {
  return <AlertDialog.Portal {...props}>{children}</AlertDialog.Portal>;
};

export const QueueAlertDialogOverlay: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogOverlayProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Overlay ref={ref} {...props} className={clsx(styles.AlertDialogOverlay, className)}>
      {children}
    </AlertDialog.Overlay>
  );
});

export const QueueAlertDialogContent: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Content ref={ref} {...props} className={clsx(styles.AlertDialogContent, className)}>
      {children}
    </AlertDialog.Content>
  );
});

export const QueueAlertDialogAction: React.ForwardRefExoticComponent<
  QueueButtonProps & AlertDialog.AlertDialogActionProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(
  ({ children, className, size = QUEUE_UI_SIZE.MEDIUM, color = QUEUE_UI_COLOR.DEFAULT, ...props }, ref) => {
    return (
      <AlertDialog.Action
        ref={ref}
        {...props}
        className={clsx(styles.AlertDialogAction, className, styles[size], styles[color])}>
        {children}
      </AlertDialog.Action>
    );
  },
);

export const QueueAlertDialogCancel: React.ForwardRefExoticComponent<
  QueueButtonProps & AlertDialog.AlertDialogCancelProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(
  ({ children, className, size = QUEUE_UI_SIZE.MEDIUM, color = QUEUE_UI_COLOR.DEFAULT, ...props }, ref) => {
    return (
      <AlertDialog.Cancel
        ref={ref}
        {...props}
        className={clsx(styles.AlertDialogCancel, className, styles[size], styles[color])}>
        {children}
      </AlertDialog.Cancel>
    );
  },
);

export const QueueAlertDialogTitle: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogTitleProps & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Title ref={ref} {...props} className={clsx(styles.AlertDialogTitle, className)}>
      {children}
    </AlertDialog.Title>
  );
});

export const QueueAlertDialogDescription: React.ForwardRefExoticComponent<
  AlertDialog.AlertDialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Description ref={ref} {...props} className={clsx(styles.AlertDialogDescription, className)}>
      {children}
    </AlertDialog.Description>
  );
});

export interface QueueAlertDialogFooterProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const QueueAlertDialogFooter: React.ForwardRefExoticComponent<
  QueueAlertDialogFooterProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(styles.AlertDialogFooter, className)}>
      {children}
    </div>
  );
});

export interface QueueSimpleAlertDialogProps {
  title: string;
  description: string;
  opened?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (opened: boolean) => void;
  onAction?: () => void;
}

export const QueueSimpleAlertDialog: React.FC<QueueSimpleAlertDialogProps> = ({
  title,
  description,
  opened = false,
  defaultOpen = false,
  onOpenChange,
  onAction,
}) => {
  return (
    <QueueAlertDialog.Root open={opened} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <QueueAlertDialog.Overlay />
      <QueueAlertDialog.Content asChild={false}>
        <QueueAlertDialog.Title>{title}</QueueAlertDialog.Title>
        <QueueAlertDialog.Description>{description}</QueueAlertDialog.Description>
        <QueueAlertDialog.Footer>
          <QueueAlertDialog.Cancel size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.RED}>
            취소
          </QueueAlertDialog.Cancel>
          <QueueAlertDialog.Action size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.BLUE} onClick={onAction}>
            확인
          </QueueAlertDialog.Action>
        </QueueAlertDialog.Footer>
      </QueueAlertDialog.Content>
    </QueueAlertDialog.Root>
  );
};

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
  SimpleAlert: QueueSimpleAlertDialog,
};
