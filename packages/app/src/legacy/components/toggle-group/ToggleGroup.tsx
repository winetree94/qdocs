import React, { forwardRef } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { QueueButtonProps } from '@legacy/components/buttons/button/Button';
import styles from './ToggleGroup.module.scss';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from '@legacy/styles/ui/Size';
import { QUEUE_UI_COLOR } from '@legacy/styles/ui/Color';

export interface QueueToggleGroupProps {
  size?: QUEUE_UI_SIZES;
}

export const QueueToogleGroupRoot = forwardRef<
  HTMLDivElement,
  QueueToggleGroupProps &
    (
      | ToggleGroup.ToggleGroupSingleProps
      | ToggleGroup.ToggleGroupMultipleProps
    ) &
    React.RefAttributes<HTMLDivElement>
>(({ children, className, size = 'medium', ...props }, ref) => {
  return (
    <ToggleGroup.Root
      ref={ref}
      {...props}
      className={clsx(styles.ToggleGroup, className, styles[size])}>
      {children}
    </ToggleGroup.Root>
  );
});

export const QueueToggleGroupItem = forwardRef<
  HTMLButtonElement,
  QueueButtonProps & ToggleGroup.ToggleGroupItemProps
>(
  (
    {
      children,
      className,
      color = QUEUE_UI_COLOR.DEFAULT,
      size = QUEUE_UI_SIZE.MEDIUM,
      ...props
    },
    ref,
  ) => {
    return (
      <ToggleGroup.Item
        ref={ref}
        {...props}
        className={clsx(
          styles.ToggleGroupItem,
          className,
          styles[color],
          styles[size],
        )}>
        {children}
      </ToggleGroup.Item>
    );
  },
);

export const QueueToggleGroup = {
  Root: QueueToogleGroupRoot,
  Item: QueueToggleGroupItem,
};
