import * as ContextMenu from '@radix-ui/react-context-menu';
import clsx from 'clsx';
import { forwardRef, FunctionComponent } from 'react';
import styles from './Context.module.scss';

export const Root: FunctionComponent<ContextMenu.ContextMenuProps> = ({ children, ...props }) => {
  return <ContextMenu.Root {...props}>{children}</ContextMenu.Root>;
};

export const Trigger = forwardRef<
  HTMLSpanElement,
  ContextMenu.ContextMenuTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.Trigger {...props} ref={ref}>
      {children}
    </ContextMenu.Trigger>
  );
});

export const Portal = ({ children, ...props }: ContextMenu.ContextMenuPortalProps) => {
  return <ContextMenu.Portal {...props}>{children}</ContextMenu.Portal>;
};

export const Content = forwardRef<
  HTMLDivElement,
  ContextMenu.ContextMenuContentProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.Content {...props} className={clsx(styles.ContextMenuContent, props.className)} ref={ref}>
      {children}
    </ContextMenu.Content>
  );
});

export const Item = forwardRef<HTMLDivElement, ContextMenu.ContextMenuItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <ContextMenu.Item {...props} className={clsx(styles.ContextMenuItem, props.className)} ref={ref}>
        {children}
      </ContextMenu.Item>
    );
  },
);

export const CheckboxItem = forwardRef<
  HTMLDivElement,
  ContextMenu.ContextMenuCheckboxItemProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.CheckboxItem {...props} className={clsx(styles.ContextMenuCheckboxItem, props.className)} ref={ref}>
      {children}
    </ContextMenu.CheckboxItem>
  );
});

export const RadioGroup = forwardRef<
  HTMLDivElement,
  ContextMenu.ContextMenuRadioGroupProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.RadioGroup {...props} ref={ref}>
      {children}
    </ContextMenu.RadioGroup>
  );
});

export const RadioItem = forwardRef<
  HTMLDivElement,
  ContextMenu.ContextMenuRadioItemProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.RadioItem {...props} className={clsx(styles.ContextMenuRadioItem, props.className)} ref={ref}>
      {children}
    </ContextMenu.RadioItem>
  );
});

export const Separator = forwardRef<
  HTMLDivElement,
  ContextMenu.ContextMenuSeparatorProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.Separator {...props} className={clsx(styles.ContextMenuSeparator, props.className)} ref={ref}>
      {children}
    </ContextMenu.Separator>
  );
});

export const MenuSub = ({ children, ...props }: ContextMenu.ContextMenuSubProps) => {
  return <ContextMenu.Sub {...props}>{children}</ContextMenu.Sub>;
};

export const SubTrigger = forwardRef<
  HTMLDivElement,
  ContextMenu.ContextMenuSubTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.SubTrigger {...props} className={clsx(styles.ContextMenuSubTrigger, props.className)} ref={ref}>
      {children}
    </ContextMenu.SubTrigger>
  );
});

export const SubContent = forwardRef<
  HTMLDivElement,
  ContextMenu.ContextMenuSubContentProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenu.SubContent {...props} className={clsx(styles.ContextMenuSubContent, props.className)} ref={ref}>
      {children}
    </ContextMenu.SubContent>
  );
});

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
