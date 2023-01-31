import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './Button.module.scss';

export const QueueButtonSize = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;

export interface QueueButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: typeof QueueButtonSize[keyof typeof QueueButtonSize];
  children?: React.ReactNode;
}

export const QueueIconButton: FunctionComponent<QueueButtonProps> = ({
  children,
  size = 'medium',
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        styles.QueueButtonBase,
        styles.QueueIconButton,
        props.className,
        styles[size],
      )}>
      {children}
    </button>
  );
};

export const QueueButton: FunctionComponent<QueueButtonProps> = ({
  children,
  size = 'medium',
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        styles.QueueButtonBase,
        styles.QueueButton,
        props.className,
        styles[size],
      )}>
      {children}
    </button>
  );
};