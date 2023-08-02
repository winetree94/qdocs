import type { Meta, StoryObj } from '@storybook/react';
import { QueueControlInputBoxComponent } from './components';

type Story = StoryObj<typeof QueueControlInputBoxComponent>;

const meta: Meta<typeof QueueControlInputBoxComponent> = {
  title: 'Components/ControlInputBox',
  component: QueueControlInputBoxComponent,
  parameters: {},
};

const inputValueChanges = (e: number) => {
    console.log('inputValueChanges e: ', e);
  };

export const Primary: Story = {
  render: () => (
    <QueueControlInputBoxComponent.IconInput valueChangeEvent={inputValueChanges} unit='degree' />
  ),
};

Primary.storyName = 'example';

export default meta;