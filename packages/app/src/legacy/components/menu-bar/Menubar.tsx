import { CheckIcon } from '@radix-ui/react-icons';
import * as Menubar from '@radix-ui/react-menubar';
import clsx from 'clsx';
import { QueueButtonProps } from '@legacy/components/buttons/button/Button';
import React from 'react';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { QUEUE_UI_COLOR } from '@legacy/styles/ui/Color';
import styles from './Menubar.module.scss';

export const Root = React.forwardRef<HTMLDivElement, Menubar.MenubarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Menubar.Root
        ref={ref}
        {...props}
        className={clsx(styles.MenubarRoot, className)}>
        {children}
      </Menubar.Root>
    );
  },
);

export const Menu = ({ children, ...props }: Menubar.MenubarMenuProps) => {
  return <Menubar.Menu {...props}>{children}</Menubar.Menu>;
};

export const Trigger = React.forwardRef<
  HTMLButtonElement,
  QueueButtonProps & Menubar.MenubarTriggerProps
>(
  (
    {
      children,
      size = QUEUE_UI_SIZE.MEDIUM,
      color = QUEUE_UI_COLOR.DEFAULT,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Menubar.Trigger
        ref={ref}
        {...props}
        className={clsx(
          styles.MenubarTrigger,
          styles[size],
          styles[color],
          className,
        )}>
        {children}
      </Menubar.Trigger>
    );
  },
);

export const Portal = ({ children, ...props }: Menubar.MenubarPortalProps) => {
  return <Menubar.Portal {...props}>{children}</Menubar.Portal>;
};

export const Content = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Content
      ref={ref}
      {...props}
      className={clsx(styles.MenubarContent, className)}>
      {children}
    </Menubar.Content>
  );
});

export const Label = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarLabelProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Label ref={ref} {...props} className={clsx(className)}>
      {children}
    </Menubar.Label>
  );
});

export const Item = React.forwardRef<HTMLDivElement, Menubar.MenubarItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Menubar.Item
        ref={ref}
        {...props}
        className={clsx(styles.MenubarItem, className)}>
        {children}
      </Menubar.Item>
    );
  },
);

export const Group = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarGroupProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Group ref={ref} {...props} className={clsx(className)}>
      {children}
    </Menubar.Group>
  );
});

export const CheckboxItem = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarCheckboxItemProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.CheckboxItem
      ref={ref}
      {...props}
      className={clsx(styles.MenubarCheckboxItem, className)}>
      {children}
    </Menubar.CheckboxItem>
  );
});

export const ItemIndicator = React.forwardRef<
  HTMLSpanElement,
  Menubar.MenubarItemIndicatorProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.ItemIndicator
      ref={ref}
      {...props}
      className={clsx(styles.MenubarItemIndicator, className)}>
      <CheckIcon />
      {children}
    </Menubar.ItemIndicator>
  );
});

export const RadioGroup = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarRadioGroupProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.RadioGroup ref={ref} {...props} className={clsx(className)}>
      {children}
    </Menubar.RadioGroup>
  );
});

export const RadioItem = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarRadioItemProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.RadioItem
      ref={ref}
      {...props}
      className={clsx(styles.MenubarRadioItem, className)}>
      {children}
    </Menubar.RadioItem>
  );
});

export const Sub = ({ children, ...props }: Menubar.MenubarSubProps) => {
  return <Menubar.Sub {...props}>{children}</Menubar.Sub>;
};

const RightSlot = React.forwardRef<
  HTMLDivElement,
  React.BaseHTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx(styles.RightSlot, className)}>
      {children}
    </div>
  );
});

export const SubTrigger = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarSubTriggerProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.SubTrigger
      ref={ref}
      {...props}
      className={clsx(styles.MenubarSubTrigger, className)}>
      {children}
    </Menubar.SubTrigger>
  );
});

export const SubContent = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarSubContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.SubContent
      ref={ref}
      {...props}
      className={clsx(styles.MenubarSubContent, className)}>
      {children}
    </Menubar.SubContent>
  );
});

export const Separator = React.forwardRef<
  HTMLDivElement,
  Menubar.MenubarSeparatorProps
>(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Separator
      ref={ref}
      {...props}
      className={clsx(styles.MenubarSeparator, className)}>
      {children}
    </Menubar.Separator>
  );
});

export const Arrow = React.forwardRef<SVGSVGElement, Menubar.MenubarArrowProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Menubar.Arrow ref={ref} {...props} className={clsx(className)}>
        {children}
      </Menubar.Arrow>
    );
  },
);

export const QueueMenubar = {
  Root,
  Menu,
  Trigger,
  Portal,
  Content,
  Label,
  Item,
  RightSlot,
  Group,
  CheckboxItem,
  ItemIndicator,
  RadioGroup,
  RadioItem,
  Sub,
  SubTrigger,
  SubContent,
  Separator,
  Arrow,
};
