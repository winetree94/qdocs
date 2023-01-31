import * as ContextMenu from '@radix-ui/react-context-menu';
import clsx from 'clsx';
import { FunctionComponent } from 'react';
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

export const Trigger: FunctionComponent<ContextMenu.ContextMenuTriggerProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.Trigger
      {...props}>
      {children}
    </ContextMenu.Trigger>
  );
};

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

export const Content: FunctionComponent<ContextMenu.ContextMenuContentProps> = ({
  children,
  ...props
}) => {
  return (
    <ContextMenu.Content
      {...props}
      className={clsx(styles.ContextMenuContent, props.className)}>
      {children}
    </ContextMenu.Content>
  );
};

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

export const Sub: FunctionComponent<ContextMenu.ContextMenuSubProps> = ({
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

export default ContextMenu;
