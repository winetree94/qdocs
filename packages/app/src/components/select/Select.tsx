import { forwardRef } from 'react';
import * as Select from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import styles from './Select.module.scss';
import { QUEUE_UI_SIZES, QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import clsx from 'clsx';
import { QUEUE_UI_COLOR, QUEUE_UI_COLORS } from '@legacy/styles/ui/Color';

export type QueueSelectProps = Select.SelectProps &
  Select.SelectContentProps &
  Select.SelectValueProps & {
    size?: QUEUE_UI_SIZES;
    color?: QUEUE_UI_COLORS;
  };

export interface QueueSelectGroupProps extends Select.SelectGroupProps {
  label?: Select.SelectLabelProps['children'];
  children: React.ReactNode;
}

type SelectContentPropsKeys = keyof Select.SelectContentProps;

const SELECT_CONTENT_PROP_KEYS: Record<string, SelectContentPropsKeys> = {
  onCloseAutoFocus: 'onCloseAutoFocus',
  onEscapeKeyDown: 'onEscapeKeyDown',
  onPointerDownOutside: 'onPointerDownOutside',
  position: 'position',
  side: 'side',
  sideOffset: 'sideOffset',
  align: 'align',
  alignOffset: 'alignOffset',
  avoidCollisions: 'avoidCollisions',
  collisionBoundary: 'collisionBoundary',
  collisionPadding: 'collisionPadding',
  arrowPadding: 'arrowPadding',
  sticky: 'sticky',
  hideWhenDetached: 'hideWhenDetached',
};

// 올바른 타입이 맞는지 모르겠음...
const getSelectContentProps = (
  props: QueueSelectProps,
): Select.SelectContentProps => {
  const selectContentProps: Select.SelectContentProps & {
    [key: string]: Select.SelectContentProps[keyof Select.SelectContentProps];
  } = {};

  Object.entries(props).reduce((acc, [key, value]) => {
    if (SELECT_CONTENT_PROP_KEYS[key]) {
      acc[key] = value;
    }

    return acc;
  }, selectContentProps);

  return selectContentProps;
};

/**
 * Root === Root & Trigger & Value & Icon & Portal & Content & ScrollUpButton & Viewport & ScrollDownButton
 */
const Root = ({
  children,
  size = QUEUE_UI_SIZE.MEDIUM,
  color = QUEUE_UI_COLOR.DEFAULT,
  placeholder,
  ...props
}: QueueSelectProps) => {
  const selectContentProps = getSelectContentProps(props);

  return (
    <Select.Root {...props}>
      <Select.Trigger
        className={clsx(styles.SelectTrigger, styles[color], styles[size])}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      {/* portal container 변경할 수 있도록 props 추가 필요 */}
      <Select.Portal>
        <Select.Content
          {...selectContentProps}
          className={styles.SelectContent}>
          <Select.ScrollUpButton className={styles.SelectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport>{children}</Select.Viewport>

          <Select.ScrollDownButton className={styles.SelectScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

/**
 * Group === Group & Label
 */
const Group = forwardRef<HTMLDivElement, QueueSelectGroupProps>(
  ({ children, label, ...props }, forwardedRef) => {
    return (
      <Select.Group {...props} ref={forwardedRef}>
        {label && (
          <Select.Label className={styles.SelectGroupLabel}>
            {label}
          </Select.Label>
        )}
        {children}
      </Select.Group>
    );
  },
);

/**
 * Option === Item & ItemIndicator & ItemText
 */
const Option = forwardRef<HTMLDivElement, Select.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={clsx(styles.SelectItem, className)}
        {...props}
        ref={forwardedRef}>
        <Select.ItemIndicator className={styles.SelectItemIndicator}>
          <CheckIcon />
        </Select.ItemIndicator>
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  },
);

const Separator = ({ className, ...props }: Select.SelectSeparatorProps) => {
  return (
    <Select.Separator
      className={clsx(styles.SelectSeparator, className)}
      {...props}
    />
  );
};

export const QueueSelect = Object.assign(Root, { Group, Option, Separator });
