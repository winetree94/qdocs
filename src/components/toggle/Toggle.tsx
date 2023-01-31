import React, { forwardRef } from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import styles from './Toggle.module.scss';
import clsx from 'clsx';

export const QueueToggleRoot: React.ForwardRefExoticComponent<
  Toggle.ToggleProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Toggle.Root
      ref={ref}
      {...props}
      className={clsx(
        styles.Toggle,
        className,
      )}>
      {children}
    </Toggle.Root>
  );
});
