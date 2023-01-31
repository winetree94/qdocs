import React, { forwardRef } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import styles from './ToogleGroup.module.scss';
import clsx from 'clsx';

export const QueueToogleGroupRoot: React.ForwardRefExoticComponent<
  (ToggleGroup.ToggleGroupSingleProps | ToggleGroup.ToggleGroupMultipleProps) &
  React.RefAttributes<HTMLDivElement>
> = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <ToggleGroup.Root
      ref={ref}
      {...props}
      className={clsx(
        styles.ToggleGroup,
        className,
      )}>
      {children}
    </ToggleGroup.Root>
  );
});

export interface QueueToggleGroupItemProps extends ToggleGroup.ToggleGroupItemProps, React.RefAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
}

export const QueueToggleGroupItem: React.ForwardRefExoticComponent<QueueToggleGroupItemProps> = forwardRef(({
  children,
  className,
  size = 'medium',
  ...props
}, ref) => {
  return (
    <ToggleGroup.Item
      ref={ref}
      {...props}
      className={clsx(
        styles.ToggleGroupItem,
        className,
        styles[size],
      )}>
      {children}
    </ToggleGroup.Item>
  );
});
