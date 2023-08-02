import type { Meta, StoryObj } from '@storybook/react';
import { QueueSelect } from './Select';

type Story = StoryObj<typeof QueueSelect>;

const meta: Meta<typeof QueueSelect> = {
  title: 'Components/Select',
  component: QueueSelect,
  parameters: {},
};

export const Primary: Story = {
  render: () => (
    <QueueSelect placeholder="Select a food">
      <QueueSelect.Group label="Vegetables">
        <QueueSelect.Option value="avocado">Avocado</QueueSelect.Option>
        <QueueSelect.Option value="broccoli">Broccoli</QueueSelect.Option>
        <QueueSelect.Option value="carrot">Carrot</QueueSelect.Option>
      </QueueSelect.Group>
      <QueueSelect.Separator />
      <QueueSelect.Option value="apple">Apple</QueueSelect.Option>
      <QueueSelect.Option value="banana">Banana</QueueSelect.Option>
    </QueueSelect>
  ),
};

export default meta;