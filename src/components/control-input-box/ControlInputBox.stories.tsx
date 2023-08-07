import type { Meta, StoryObj } from '@storybook/react';
import { QueueControlInputBox } from './components';

type Story = StoryObj<typeof QueueControlInputBox>;

const meta: Meta<typeof QueueControlInputBox> = {
  title: 'Components/ControlInputBox',
  component: QueueControlInputBox,
  parameters: {},
};

const inputValueChanges = (e: number) => {
    console.log('inputValueChanges e: ', e);
  };

export const Primary: Story = {
  render: () => (
    <QueueControlInputBox.Wrapper color='grey' variant='filled'>
    <QueueControlInputBox.InputBox unit='percent' valueChangeEvent={inputValueChanges}></QueueControlInputBox.InputBox>
    </QueueControlInputBox.Wrapper>
    ),
};

Primary.storyName = 'example';

export default meta;
