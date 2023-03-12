import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Button.module.scss';

export const QueueButtonSize = {
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
} as const;

export const QueueButtonColor = {
  DEFAULT: 'default',
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  TRANSPARENT: 'transparent',
} as const;

export interface BaseQueueButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: typeof QueueButtonSize[keyof typeof QueueButtonSize];
  color?: typeof QueueButtonColor[keyof typeof QueueButtonColor];
  round?: boolean;
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QueueIconButtonProps extends BaseQueueButtonProps {}

export const QueueIconButton: React.ForwardRefExoticComponent<
  QueueIconButtonProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(({ children, round = false, size = 'medium', color = 'default', disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      className={clsx(
        styles.QueueIconButton,
        props.className,
        styles[size],
        styles[color],
        round ? styles.round : null,
        disabled ? styles.Disabled : null,
      )}>
      {children}
    </button>
  );
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QueueButtonProps extends BaseQueueButtonProps {}

export const QueueButton: React.ForwardRefExoticComponent<QueueButtonProps & React.RefAttributes<HTMLButtonElement>> =
  forwardRef(({ children, round = false, size = 'medium', color = 'default', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled}
        className={clsx(
          styles.QueueButton,
          props.className,
          styles[size],
          styles[color],
          round ? styles.round : null,
          disabled ? styles.Disabled : null,
        )}>
        {children}
      </button>
    );
  });
