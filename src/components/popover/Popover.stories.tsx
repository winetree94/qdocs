/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { QueueButton } from 'components/buttons/button/Button';
import {
  QueuePopover,
  QueuePopoverRootProps,
} from 'components/popover/Popover';
import { useState } from 'react';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

type Story = StoryObj<typeof QueuePopover.Root>;

const meta: Meta<typeof QueuePopover.Root> = {
  title: 'Components/Popover',
  component: QueuePopover.Root,
  parameters: {
    open: true,
  },
  argTypes: {
    open: { control: { type: 'boolean' } },
    defaultOpen: { control: { type: 'boolean' } },
    onOpenChange: { action: 'onOpenChange' },
  },
};

export const Basic: Story = {
  render: (props: Partial<QueuePopoverRootProps>) => {
    const [open, setOpen] = useState<boolean>(props.open);
    return (
      <span>
        <QueuePopover.Root
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            props.onOpenChange?.(open);
          }}
          defaultOpen={props.defaultOpen}>
          <QueuePopover.Anchor>
            <QueueButton
              size={QUEUE_UI_SIZE.MEDIUM}
              color={QUEUE_UI_COLOR.RED}
              onClick={() => setOpen(!open)}>
              open
            </QueueButton>
          </QueuePopover.Anchor>
          <QueuePopover.Content>
            <div>Content</div>
            <QueueButton size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.RED}>
              close
            </QueueButton>
          </QueuePopover.Content>
        </QueuePopover.Root>
      </span>
    );
  },
  args: {},
};

export default meta;
