import React, { forwardRef } from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import styles from './Toggle.module.scss';
import clsx from 'clsx';
import { QueueButtonProps } from 'components/button/Button';

export const QueueToggleRoot: React.ForwardRefExoticComponent<
  QueueButtonProps & Toggle.ToggleProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(({
  children,
  className,
  round = false,
  color = 'default',
  size = 'medium',
  ...props
}, ref) => {
  return (
    <Toggle.Root
      ref={ref}
      {...props}
      className={clsx(
        styles.Toggle,
        className,
        styles[color],
        styles[size],
        round && styles.round
      )}>
      {children}
    </Toggle.Root>
  );
});

export const QueueToggle = {
  Root: QueueToggleRoot,
};
