import React, { forwardRef } from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import styles from './Toggle.module.scss';
import clsx from 'clsx';
import { QueueButtonProps } from 'components/buttons/button/Button';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

export const QueueToggleRoot = forwardRef<HTMLButtonElement, QueueButtonProps & Toggle.ToggleProps>(
  ({ children, className, color = QUEUE_UI_COLOR.DEFAULT, size = QUEUE_UI_SIZE.MEDIUM, ...props }, ref) => {
    return (
      <Toggle.Root ref={ref} {...props} className={clsx(styles.Toggle, className, styles[color], styles[size])}>
        {children}
      </Toggle.Root>
    );
  },
);

export const QueueToggle = {
  Root: QueueToggleRoot,
};
