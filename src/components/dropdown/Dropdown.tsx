import { forwardRef } from 'react';
import clsx from 'clsx';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { CheckIcon, DotFilledIcon } from '@radix-ui/react-icons';

export interface QueueDropdownGroupProps extends Dropdown.MenuGroupProps {
  label?: Dropdown.MenuLabelProps['children'];
}

export interface QueueDropdownRadioGroupProps
  extends Dropdown.MenuRadioGroupProps {
  label?: Dropdown.MenuLabelProps['children'];
}

const DropdownItemBase = [
  'tw-relative',
  'tw-flex',
  'tw-px-6',
  'tw-py-2',
  'tw-text-[var(--mauve-12)]',
  'tw-cursor-pointer',
  'tw-outline-none',
  'hover:tw-bg-[var(--blue-10)]',
  'hover:tw-text-[var(--blue-1)]',
  'active:tw-bg-[var(--blue-11)]',
  'data-[disabled]:tw-pointer-events-none',
  'data-[disabled]:tw-text-[var(--gray-8)]',
];

const DropdownLabelBase = [
  'tw-pl-6',
  'tw-text-xs',
  'tw-text-[var(--mauve-9)]',
  'tw-cursor-default',
];

const DropdownIndicatorBase = [
  'tw-absolute',
  'tw-left-0',
  'tw-top-0',
  'tw-w-6',
  'tw-h-full',
  'tw-flex',
  'tw-items-center',
  'tw-justify-center',
];

const Content = forwardRef<HTMLDivElement, Dropdown.MenuContentProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Dropdown.Portal>
        <Dropdown.Content
          className={clsx(
            'tw-py-1 tw-rounded-sm tw-bg-white tw-drop-shadow-md tw-text-sm',
            className,
          )}
          {...props}
          ref={forwardedRef}>
          {children}
          <Dropdown.Arrow
            className={clsx('tw-fill-white')}
            width={12}
            height={8}
          />
        </Dropdown.Content>
      </Dropdown.Portal>
    );
  },
);

const Group = forwardRef<HTMLDivElement, QueueDropdownGroupProps>(
  ({ children, label, ...props }, forwardedRef) => {
    return (
      <Dropdown.Group {...props} ref={forwardedRef}>
        <Dropdown.Label className={clsx(DropdownLabelBase)}>
          {label}
        </Dropdown.Label>
        {children}
      </Dropdown.Group>
    );
  },
);

const RadioGroup = forwardRef<HTMLDivElement, QueueDropdownRadioGroupProps>(
  ({ children, label, ...props }, forwardedRef) => {
    return (
      <Dropdown.RadioGroup {...props} ref={forwardedRef}>
        <Dropdown.Label className={clsx(DropdownLabelBase)}>
          {label}
        </Dropdown.Label>
        {children}
      </Dropdown.RadioGroup>
    );
  },
);

const Item = forwardRef<HTMLDivElement, Dropdown.MenuItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Dropdown.Item
        className={clsx(DropdownItemBase, '', className)}
        {...props}
        ref={forwardedRef}>
        {children}
      </Dropdown.Item>
    );
  },
);

const CheckboxItem = forwardRef<HTMLDivElement, Dropdown.MenuCheckboxItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Dropdown.CheckboxItem
        className={clsx(DropdownItemBase, className)}
        {...props}
        ref={forwardedRef}>
        <Dropdown.ItemIndicator className={clsx(DropdownIndicatorBase)}>
          <CheckIcon />
        </Dropdown.ItemIndicator>
        {children}
      </Dropdown.CheckboxItem>
    );
  },
);

const RadioItem = forwardRef<HTMLDivElement, Dropdown.MenuRadioItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Dropdown.RadioItem
        className={clsx(DropdownItemBase, className)}
        {...props}
        ref={forwardedRef}>
        <Dropdown.ItemIndicator className={clsx(DropdownIndicatorBase)}>
          <DotFilledIcon />
        </Dropdown.ItemIndicator>
        {children}
      </Dropdown.RadioItem>
    );
  },
);

const Separator = forwardRef<HTMLDivElement, Dropdown.MenuSeparatorProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <Dropdown.Separator
        className={clsx('tw-h-px tw-mx-2 tw-my-1.5 tw-bg-stone-100', className)}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

const SubContent = forwardRef<HTMLDivElement, Dropdown.MenuSubContentProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Dropdown.Portal>
        <Dropdown.SubContent
          className={clsx(
            'tw-py-2 tw-rounded-sm tw-bg-white tw-text-sm tw-drop-shadow-md',
            className,
          )}
          {...props}
          ref={forwardedRef}>
          {children}
        </Dropdown.SubContent>
      </Dropdown.Portal>
    );
  },
);

const ItemIndicator = forwardRef<
  HTMLDivElement,
  Dropdown.MenuItemIndicatorProps
>(({ className, ...props }, forwardedRef) => {
  return (
    <Dropdown.ItemIndicator
      className={clsx(
        'tw-absolute tw-left-0 tw-top-0 tw-w-6 tw-h-full tw-flex tw-items-center tw-justify-center',
        className,
      )}
      {...props}
      ref={forwardedRef}
    />
  );
});

export const QueueDropdown = Object.assign(Dropdown.Root, {
  Content,
  Group,
  RadioGroup,
  Item,
  CheckboxItem,
  RadioItem,
  Separator,
  SubContent,
  Trigger: Dropdown.Trigger,
  Sub: Dropdown.Sub,
  SubTrigger: Dropdown.SubTrigger,
  ItemIndicator,
});
