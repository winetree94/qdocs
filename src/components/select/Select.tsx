import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './Select.module.scss';
import { CheckIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

export const Root = ({ children, ...props }: Select.SelectProps) => {
  return <Select.Root {...props}>{children}</Select.Root>;
};

export const Trigger = React.forwardRef<
  HTMLButtonElement,
  Select.SelectTriggerProps & React.RefAttributes<HTMLButtonElement>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Trigger {...props} ref={forwardedRef} className={clsx(className, styles.SelectTrigger)}>
      {children}
    </Select.Trigger>
  );
});

export const Value = React.forwardRef<HTMLDivElement, Select.SelectValueProps & React.RefAttributes<HTMLButtonElement>>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Value {...props} ref={forwardedRef} className={clsx(className, styles.SelectValue)}>
        {children}
      </Select.Value>
    );
  },
);

export const Icon = React.forwardRef<HTMLDivElement, Select.SelectIconProps & React.RefAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Icon {...props} ref={forwardedRef} className={clsx(className, styles.SelectIcon)}>
        {children}
      </Select.Icon>
    );
  },
);

export const Portal = ({ children, ...props }: Select.SelectPortalProps & React.RefAttributes<HTMLDivElement>) => {
  return <Select.Portal {...props}>{children}</Select.Portal>;
};

export const Content = React.forwardRef<
  HTMLDivElement,
  Select.SelectContentProps & React.RefAttributes<HTMLDivElement>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Content {...props} ref={forwardedRef} className={clsx(className, styles.SelectContent)}>
      {children}
    </Select.Content>
  );
});

export const ScrollUpButton = React.forwardRef<
  HTMLDivElement,
  Select.SelectScrollUpButtonProps & React.RefAttributes<HTMLDivElement>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.ScrollUpButton {...props} ref={forwardedRef} className={clsx(className, styles.SelectScrollButton)}>
      {children}
    </Select.ScrollUpButton>
  );
});

export const ScrollDownButton = React.forwardRef<
  HTMLDivElement,
  Select.SelectScrollDownButtonProps & React.RefAttributes<HTMLDivElement>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.ScrollDownButton {...props} ref={forwardedRef} className={clsx(className, styles.SelectScrollButton)}>
      {children}
    </Select.ScrollDownButton>
  );
});

export const Viewport = React.forwardRef<
  HTMLDivElement,
  Select.SelectViewportProps & React.RefAttributes<HTMLDivElement>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Viewport {...props} ref={forwardedRef} className={clsx(className, styles.SelectViewport)}>
      {children}
    </Select.Viewport>
  );
});

export const Group = React.forwardRef<HTMLDivElement, Select.SelectGroupProps & React.RefAttributes<HTMLDivElement>>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Select.Group {...props} ref={forwardedRef}>
        {children}
      </Select.Group>
    );
  },
);

export const Label = React.forwardRef<HTMLDivElement, Select.SelectLabelProps & React.RefAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Label {...props} ref={forwardedRef} className={clsx(className, styles.SelectLabel)}>
        {children}
      </Select.Label>
    );
  },
);

export const Item = React.forwardRef<HTMLDivElement, Select.SelectItemProps & React.RefAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item className={clsx(className, styles.SelectItem)} {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

export const Separator = React.forwardRef<HTMLDivElement, Select.SelectItemProps & React.RefAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Separator {...props} ref={forwardedRef} className={clsx(className, styles.SelectSeparator)}>
        {children}
      </Select.Separator>
    );
  },
);

export const QueueSelect = {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  ScrollUpButton,
  ScrollDownButton,
  Viewport,
  Group,
  Label,
  Item,
  Separator,
};
