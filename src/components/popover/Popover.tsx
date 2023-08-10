import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import styles from './Popover.module.scss';

export interface QueuePopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (opened: boolean) => void;
  children?: React.ReactNode;
}

const QueuePopoverRoot = ({ children, ...props }: QueuePopoverRootProps) => {
  return (
    <Popover.Root
      {...props}
    >
      {children}
    </Popover.Root>
  );
};

const QueuePopoverAnchor = ({ children, className, ...props }: Popover.PopoverAnchorProps) => {
  return (
    <Popover.Anchor
      {...props}
      className={clsx(styles.Anchor, className)}
    >
      {children}
    </Popover.Anchor>
  );
};

export interface QueuePopoverContentProps {
  arrow?: boolean;
  children?: React.ReactNode;
}

const QueuePopoverContent = ({ children, ...props }: QueuePopoverContentProps) => {
  return (
    <Popover.Portal>
      <Popover.Content className={clsx(styles.Content)}>
        {children}
        {props.arrow && <Popover.Arrow />}
      </Popover.Content>
    </Popover.Portal>
  );
};

export const QueuePopover = {
  Root: QueuePopoverRoot,
  Anchor: QueuePopoverAnchor,
  Content: QueuePopoverContent,
};