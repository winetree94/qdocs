import type { StoryObj, Meta } from '@storybook/react';
import { useState } from 'react';
import { QueueDropdown } from './Dropdown';

type Story = StoryObj<typeof QueueDropdown>;

const meta: Meta<typeof QueueDropdown> = {
  title: 'Components/Dropdown',
  component: QueueDropdown,
  parameters: {},
};

export const Primary: Story = {
  render: () => {
    const [itemChecked, setItemChecked] = useState(true);
    const [item2Checked, setItem2Checked] = useState(false);
    const [radioValue, setRadioValue] = useState<string | undefined>('radio1');

    return (
      <div className="tw-w-full tw-h-screen tw-p-6 tw-bg-slate-100">
        <QueueDropdown defaultOpen>
          <QueueDropdown.Trigger asChild>
            <button type="button">Trigger</button>
          </QueueDropdown.Trigger>

          <QueueDropdown.Content side="right" className="tw-w-[200px]">
            <QueueDropdown.Item>Item 1</QueueDropdown.Item>

            <QueueDropdown.Group label="Group 1">
              <QueueDropdown.Item>Item 2</QueueDropdown.Item>
              <QueueDropdown.Item disabled>Item 3</QueueDropdown.Item>
            </QueueDropdown.Group>

            <QueueDropdown.Separator />

            <QueueDropdown.Group label="checkbox group">
              <QueueDropdown.CheckboxItem
                checked={itemChecked}
                onCheckedChange={setItemChecked}>
                CheckboxItem 1
              </QueueDropdown.CheckboxItem>
              <QueueDropdown.CheckboxItem
                checked={item2Checked}
                onCheckedChange={setItem2Checked}>
                CheckboxItem 2
              </QueueDropdown.CheckboxItem>
            </QueueDropdown.Group>

            <QueueDropdown.RadioGroup
              label="radio group"
              value={radioValue}
              onValueChange={setRadioValue}>
              <QueueDropdown.RadioItem value="radio1">
                RadioItem 1
              </QueueDropdown.RadioItem>
              <QueueDropdown.RadioItem value="radio2">
                RadioItem 2
              </QueueDropdown.RadioItem>
            </QueueDropdown.RadioGroup>

            <QueueDropdown.Separator />

            <QueueDropdown.Sub>
              <QueueDropdown.SubTrigger asChild>
                <QueueDropdown.Item>Sub Trigger</QueueDropdown.Item>
              </QueueDropdown.SubTrigger>

              <QueueDropdown.SubContent className="tw-w-[200px]">
                <QueueDropdown.Item>Sub Item 1</QueueDropdown.Item>
                <QueueDropdown.Item>Sub Item 2</QueueDropdown.Item>
                <QueueDropdown.Item>Sub Item 3</QueueDropdown.Item>
              </QueueDropdown.SubContent>
            </QueueDropdown.Sub>
          </QueueDropdown.Content>
        </QueueDropdown>
      </div>
    );
  },
};

export default meta;
