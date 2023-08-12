import type { Meta, StoryObj } from '@storybook/react';
import { QueueButton } from 'components/buttons/button/Button';
import { QueueDialog, QueueDialogRootProps } from 'components/dialog/Dialog';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

type Story = StoryObj<typeof QueueDialog.Root>;

const meta: Meta<typeof QueueDialog.Root> = {
  title: 'Components/Dialog',
  component: QueueDialog.Root,
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
  render: (props: Partial<QueueDialogRootProps>) => {
    return (
      <QueueDialog.Root
        open={props.open}
        defaultOpen={props.open}
        onOpenChange={props.onOpenChange}>
        <QueueDialog.Title>Dialog Title</QueueDialog.Title>
        <QueueDialog.Description>Dialog Description</QueueDialog.Description>
        <QueueDialog.Footer>
          <QueueButton size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.RED}>
            Cancel
          </QueueButton>
          <QueueButton size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.BLUE}>
            Submit
          </QueueButton>
        </QueueDialog.Footer>
      </QueueDialog.Root>
    );
  },
  args: {},
};

export default meta;
