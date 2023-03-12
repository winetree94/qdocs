import React, { forwardRef } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { QueueButtonProps, QueueButtonSize } from 'components/button/Button';
import styles from './ToggleGroup.module.scss';

export interface QueueToggleGroupProps {
  size?: typeof QueueButtonSize[keyof typeof QueueButtonSize];
}

export const QueueToogleGroupRoot: React.ForwardRefExoticComponent<
  QueueToggleGroupProps &
    (ToggleGroup.ToggleGroupSingleProps | ToggleGroup.ToggleGroupMultipleProps) &
    React.RefAttributes<HTMLDivElement>
> = forwardRef(({ children, className, size = 'medium', ...props }, ref) => {
  return (
    <ToggleGroup.Root ref={ref} {...props} className={clsx(styles.ToggleGroup, className, styles[size])}>
      {children}
    </ToggleGroup.Root>
  );
});

export const QueueToggleGroupItem: React.ForwardRefExoticComponent<
  QueueButtonProps & ToggleGroup.ToggleGroupItemProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(({ children, className, round = false, color = 'default', size = 'medium', ...props }, ref) => {
  return (
    <ToggleGroup.Item
      ref={ref}
      {...props}
      className={clsx(styles.ToggleGroupItem, className, styles[color], styles[size], round && styles.round)}>
      {children}
    </ToggleGroup.Item>
  );
});

export const QueueToggleGroup = {
  Root: QueueToogleGroupRoot,
  Item: QueueToggleGroupItem,
};
