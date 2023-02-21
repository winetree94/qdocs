import styles from './Input.module.scss';
import clsx from 'clsx';
import { forwardRef } from 'react';

export interface QueueInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: number;
}

export const QueueInput: React.ForwardRefExoticComponent<QueueInputProps & React.RefAttributes<HTMLInputElement>> =
  forwardRef(({ className, ...props }, ref) => {
    return <input ref={ref} {...props} className={clsx(styles.input, className)} />;
  });
