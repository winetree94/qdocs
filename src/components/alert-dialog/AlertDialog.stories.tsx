import type { Meta, StoryObj } from '@storybook/react';
import { QueueAlertDialog, QueueAlertDialogRootProps } from 'components/alert-dialog/AlertDialog';
import { QueueButton } from 'components/buttons/button/Button';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';

type Story = StoryObj<typeof QueueAlertDialog.Root>;

const meta: Meta<typeof QueueAlertDialog.Root> = {
  title: 'Components/AlertDialog',
  component: QueueAlertDialog.Root,
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
  render: (props: Partial<QueueAlertDialogRootProps>) => {
    return (
      <QueueAlertDialog.Root open={props.open} defaultOpen={props.open} onOpenChange={props.onOpenChange}>
        <QueueAlertDialog.Title>Dialog Title</QueueAlertDialog.Title>
        <QueueAlertDialog.Description>Dialog Description</QueueAlertDialog.Description>
        <QueueAlertDialog.Footer>
          <QueueButton size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.RED}>
            Cancel
          </QueueButton>
          <QueueButton size={QUEUE_UI_SIZE.MEDIUM} color={QUEUE_UI_COLOR.BLUE}>
            Submit
          </QueueButton>
        </QueueAlertDialog.Footer>
      </QueueAlertDialog.Root>
    );
  },
  args: {},
};

export default meta;
