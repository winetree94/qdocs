import * as Menubar from '@radix-ui/react-menubar';
import clsx from 'clsx';
import React from 'react';
import styles from './Menubar.module.scss';

export const Root: React.ForwardRefExoticComponent<
  Menubar.MenubarProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Root
      ref={ref}
      {...props}
      className={clsx(styles.MenubarRoot, className)}
    >
      {children}
    </Menubar.Root>
  );
});

export const Menu: React.FC<Menubar.ScopedProps<Menubar.MenubarMenuProps>> = ({ children, ...props }) => {
  return (
    <Menubar.Menu
      {...props}
    >
      {children}
    </Menubar.Menu>
  );
};

export const Trigger: React.ForwardRefExoticComponent<
  Menubar.MenubarTriggerProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Trigger
      ref={ref}
      {...props}
      className={clsx(styles.MenubarTrigger, className)}
    >
      {children}
    </Menubar.Trigger>
  );
});

export const Portal: React.FC<Menubar.MenubarPortalProps> = ({ children, className, ...props }) => {
  return (
    <Menubar.Portal
      {...props}
      className={clsx(styles.MenubarPortal, className)}
    >
      {children}
    </Menubar.Portal>
  );
};

export const Content: React.ForwardRefExoticComponent<
  Menubar.MenubarContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Content
      ref={ref}
      {...props}
      className={clsx(styles.MenubarContent, className)}
    >
      {children}
    </Menubar.Content>
  );
});

export const Label: React.ForwardRefExoticComponent<
  Menubar.MenubarLabelProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Label
      ref={ref}
      {...props}
      className={clsx(styles.MenubarLabel, className)}
    >
      {children}
    </Menubar.Label>
  );
});

export const Item: React.ForwardRefExoticComponent<
  Menubar.MenubarItemProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Item
      ref={ref}
      {...props}
      className={clsx(styles.MenubarItem, className)}
    >
      {children}
    </Menubar.Item>
  );
});

export const Group: React.ForwardRefExoticComponent<
  Menubar.MenubarGroupProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Group
      ref={ref}
      {...props}
      className={clsx(styles.MenubarGroup, className)}
    >
      {children}
    </Menubar.Group>
  );
});

export const CheckboxItem: React.ForwardRefExoticComponent<
  Menubar.MenubarCheckboxItemProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.CheckboxItem
      ref={ref}
      {...props}
      className={clsx(styles.MenubarCheckboxItem, className)}
    >
      {children}
    </Menubar.CheckboxItem>
  );
});

export const ItemIndicator: React.ForwardRefExoticComponent<
  Menubar.MenubarItemIndicatorProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.ItemIndicator
      ref={ref}
      {...props}
      className={clsx(styles.MenubarItemIndicator, className)}
    >
      {children}
    </Menubar.ItemIndicator>
  );
});

export const RadioGroup: React.ForwardRefExoticComponent<
  Menubar.MenubarRadioGroupProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.RadioGroup
      ref={ref}
      {...props}
      className={clsx(styles.MenubarRadioGroup, className)}
    >
      {children}
    </Menubar.RadioGroup>
  );
});

export const RadioItem: React.ForwardRefExoticComponent<
  Menubar.MenubarRadioItemProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.RadioItem
      ref={ref}
      {...props}
      className={clsx(styles.MenubarRadioItem, className)}
    >
      {children}
    </Menubar.RadioItem>
  );
});

export const Sub: React.FC<Menubar.MenubarSubProps> = ({ children, ...props }) => {
  return (
    <Menubar.Sub {...props}>
      {children}
    </Menubar.Sub>
  );
};

export const SubTrigger: React.ForwardRefExoticComponent<
  Menubar.MenubarSubTriggerProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.SubTrigger
      ref={ref}
      {...props}
      className={clsx(styles.MenubarSubTrigger, className)}
    >
      {children}
    </Menubar.SubTrigger>
  );
});

export const SubContent: React.ForwardRefExoticComponent<
  Menubar.MenubarSubContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.SubContent
      ref={ref}
      {...props}
      className={clsx(styles.MenubarSubContent, className)}
    >
      {children}
    </Menubar.SubContent>
  );
});


export const Separator: React.ForwardRefExoticComponent<
  Menubar.MenubarSeparatorProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Separator
      ref={ref}
      {...props}
      className={clsx(styles.MenubarSeparator, className)}
    >
      {children}
    </Menubar.Separator>
  );
});

export const Arrow: React.ForwardRefExoticComponent<
  Menubar.MenubarArrowProps & React.RefAttributes<SVGSVGElement>
> = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <Menubar.Arrow
      ref={ref}
      {...props}
      className={clsx(styles.MenubarArrow, className)}
    >
      {children}
    </Menubar.Arrow>
  );
});

export const QueueMenubar = {
  Root,
  Menu,
  Trigger,
  Portal,
  Content,
  Label,
  Item,
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
