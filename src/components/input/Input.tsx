import styles from './Input.module.scss';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from 'styles/ui/Size';

export interface QueueInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: QUEUE_UI_SIZES;
  type?: 'text' | 'password' | 'email' | 'number';
}

export const QueueInput = forwardRef<HTMLInputElement, QueueInputProps> (
  ({ className, size = QUEUE_UI_SIZE.MEDIUM, ...props }, ref) => {
    return <input ref={ref} {...props} className={clsx(styles.input, styles[size], className)} />;
  },
);
