import clsx from 'clsx';
import { forwardRef } from 'react';
import { QUEUE_UI_COLOR, QUEUE_UI_COLORS } from 'styles/ui/Color';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from 'styles/ui/Size';
import styles from './Button.module.scss';

export interface BaseQueueButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: QUEUE_UI_SIZES;
  color?: QUEUE_UI_COLORS;
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QueueIconButtonProps extends BaseQueueButtonProps {}

export const QueueIconButton = forwardRef<
  HTMLButtonElement,
  QueueIconButtonProps
>(({ children, size = QUEUE_UI_SIZE.MEDIUM, color = QUEUE_UI_COLOR.DEFAULT, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      className={clsx(styles.QueueIconButton, props.className, styles[size], styles[color])}>
      {children}
    </button>
  );
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QueueButtonProps extends BaseQueueButtonProps {}

export const QueueButton = forwardRef<HTMLButtonElement, QueueButtonProps>(
  ({ children, size = QUEUE_UI_SIZE.MEDIUM, color = QUEUE_UI_COLOR.DEFAULT, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled}
        className={clsx(styles.QueueButton, props.className, styles[size], styles[color])}>
        {children}
      </button>
    );
  },
);
