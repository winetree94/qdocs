import * as ContextMenu from '@radix-ui/react-context-menu';
import clsx from 'clsx';
import { forwardRef, FunctionComponent } from 'react';
import styles from './Context.module.scss';

export const Root: FunctionComponent<ContextMenu.ContextMenuProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.Root
      {...props}>
      {children}
    </ContextMenu.Root>
  );
};

export const Trigger: React.ForwardRefExoticComponent<
  ContextMenu.ContextMenuTriggerProps & React.RefAttributes<HTMLSpanElement>
> = forwardRef(({
  children,
  ...props
}, ref) => {
  return (
    <ContextMenu.Trigger
      ref={ref}
      {...props}>
      {children}
    </ContextMenu.Trigger>
  );
});

export const Portal: FunctionComponent<ContextMenu.ContextMenuPortalProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.Portal
      {...props}>
      {children}
    </ContextMenu.Portal>
  );
};

export const Content: React.ForwardRefExoticComponent<
  ContextMenu.ContextMenuContentProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({
  children,
  ...props
}, ref) => {
  return (
    <ContextMenu.Content
      ref={ref}
      {...props}
      className={clsx(styles.ContextMenuContent, props.className)}>
      {children}
    </ContextMenu.Content>
  );
});

export const Item: FunctionComponent<ContextMenu.ContextMenuItemProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.Item
      {...props}
      className={clsx(styles.ContextMenuItem, props.className)}>
      {children}
    </ContextMenu.Item>
  );
};

export const CheckboxItem: FunctionComponent<ContextMenu.ContextMenuCheckboxItemProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.CheckboxItem
      {...props}
      className={clsx(styles.ContextMenuCheckboxItem, props.className)}>
      {children}
    </ContextMenu.CheckboxItem>
  );
};

export const RadioGroup: FunctionComponent<ContextMenu.ContextMenuRadioGroupProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.RadioGroup
      {...props}>
      {children}
    </ContextMenu.RadioGroup>
  );
};

export const RadioItem: FunctionComponent<ContextMenu.ContextMenuRadioItemProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.RadioItem
      {...props}
      className={clsx(styles.ContextMenuRadioItem, props.className)}>
      {children}
    </ContextMenu.RadioItem>
  );
};

export const Separator: FunctionComponent<ContextMenu.ContextMenuSeparatorProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.Separator
      {...props}
      className={clsx(styles.ContextMenuSeparator, props.className)}>
      {children}
    </ContextMenu.Separator>
  );
};

export const MenuSub: FunctionComponent<ContextMenu.ContextMenuSubProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.Sub
      {...props}>
      {children}
    </ContextMenu.Sub>
  );
};

export const SubTrigger: FunctionComponent<ContextMenu.ContextMenuSubTriggerProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.SubTrigger
      {...props}
      className={clsx(styles.ContextMenuSubTrigger, props.className)}>
      {children}
    </ContextMenu.SubTrigger>
  );
};

export const SubContent: FunctionComponent<ContextMenu.ContextMenuSubContentProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.SubContent
      {...props}
      className={clsx(styles.ContextMenuSubContent, props.className)}>
      {children}
    </ContextMenu.SubContent>
  );
};

export const QueueContextMenu = {
  Root: Root,
  Trigger: Trigger,
  Portal: Portal,
  Content: Content,
  Item: Item,
  CheckboxItem: CheckboxItem,
  RadioGroup: RadioGroup,
  RadioItem: RadioItem,
  Separator: Separator,
  Sub: MenuSub,
  SubTrigger: SubTrigger,
  SubContent: SubContent,
};
