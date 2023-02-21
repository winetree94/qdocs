import { forwardRef, ReactElement } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, DotFilledIcon } from '@radix-ui/react-icons';
import classes from './Dropdown.module.scss';
import clsx from 'clsx';

export const Dropdown = ({ children, ...dropdownMenuProps }: DropdownMenuPrimitive.DropdownMenuProps): ReactElement => {
  return <DropdownMenuPrimitive.Root {...dropdownMenuProps}>{children}</DropdownMenuPrimitive.Root>;
};

const DropdownContent = forwardRef<HTMLDivElement, DropdownMenuPrimitive.DropdownMenuContentProps>(
  ({ children, className, ...dropdownContentProps }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={clsx(classes['dropdown-content'], className)}
          ref={forwardedRef}
          {...dropdownContentProps}>
          {children}
          <DropdownMenuPrimitive.Arrow className={classes['dropdown-arrow']} width={12} height={8} />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  },
);

const DropdownItem = ({
  children,
  className,
  ...dropdownItemProps
}: DropdownMenuPrimitive.DropdownMenuItemProps): ReactElement => {
  return (
    <DropdownMenuPrimitive.Item className={clsx(classes['dropdown-item'], className)} {...dropdownItemProps}>
      {children}
    </DropdownMenuPrimitive.Item>
  );
};

const DropdownCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuPrimitive.DropdownMenuCheckboxItemProps>(
  ({ children, className, ...dropdownCheckboxProps }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        className={clsx(classes['dropdown-item'])}
        ref={forwardedRef}
        {...dropdownCheckboxProps}>
        <DropdownMenuPrimitive.ItemIndicator className={classes['dropdown-indicator']}>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
        {children}
      </DropdownMenuPrimitive.CheckboxItem>
    );
  },
);

const DropdownRadioItem = forwardRef<HTMLDivElement, DropdownMenuPrimitive.DropdownMenuRadioItemProps>(
  ({ children, className, ...dropdownRadioItemProps }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.RadioItem
        className={clsx(classes['dropdown-item'])}
        ref={forwardedRef}
        {...dropdownRadioItemProps}>
        <DropdownMenuPrimitive.ItemIndicator className={classes['dropdown-indicator']}>
          <DotFilledIcon />
        </DropdownMenuPrimitive.ItemIndicator>
        {children}
      </DropdownMenuPrimitive.RadioItem>
    );
  },
);

const DropdownLabel = ({
  children,
  className,
  ...dropdownLabelProps
}: DropdownMenuPrimitive.DropdownMenuLabelProps): ReactElement => {
  return (
    <DropdownMenuPrimitive.Label className={clsx(classes['dropdown-label'], className)} {...dropdownLabelProps}>
      {children}
    </DropdownMenuPrimitive.Label>
  );
};

const DropdownSeparator = ({
  className,
  ...dropdownSeparatorProps
}: DropdownMenuPrimitive.MenuSeparatorProps): ReactElement => {
  return (
    <DropdownMenuPrimitive.Separator
      className={clsx(classes['dropdown-separator'], className)}
      {...dropdownSeparatorProps}
    />
  );
};

const DropdownTrigger = ({
  children,
  className,
  ...dropdownTriggerProps
}: DropdownMenuPrimitive.DropdownMenuTriggerProps): ReactElement => {
  return (
    <DropdownMenuPrimitive.Trigger className={clsx(classes['dropdown-trigger'], className)} {...dropdownTriggerProps}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
};

Dropdown.Content = DropdownContent;
Dropdown.Group = DropdownMenuPrimitive.Group;
Dropdown.RadioGroup = DropdownMenuPrimitive.RadioGroup;
Dropdown.Item = DropdownItem;
Dropdown.RadioItem = DropdownRadioItem;
Dropdown.CheckboxItem = DropdownCheckboxItem;
Dropdown.Label = DropdownLabel;
Dropdown.Separator = DropdownSeparator;
Dropdown.Trigger = DropdownTrigger;
