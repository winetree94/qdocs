import styles from './Input.module.scss';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from '@legacy/styles/ui/Size';

export interface QueueInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: QUEUE_UI_SIZES;
  type?: 'text' | 'password' | 'email' | 'number';
  variant?: 'default' | 'filled' | 'outline';
}

const variantClassMap: {
  [key in QueueInputProps['variant']]: string[] | string;
} = {
  default: [],
  filled: ['tw-border-none', 'tw-bg-[#E7E6EB]'],
  outline: ['tw-border', 'tw-border-[#E7E6EB]'],
};

export const QueueInput = forwardRef<HTMLInputElement, QueueInputProps>(
  (
    { className, size = QUEUE_UI_SIZE.MEDIUM, variant = 'default', ...props },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          styles.input,
          styles[size],
          variantClassMap[variant],
          className,
        )}
      />
    );
  },
);
