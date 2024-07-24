import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { QueueControlInputBox } from './components';
import {
  QueueControlInputBoxProps,
  QueueControlInputPrefixIconProps,
  QueueControlInputWrapperProps,
} from './model';

export type allProps = QueueControlInputWrapperProps &
  QueueControlInputPrefixIconProps &
  QueueControlInputBoxProps & { inputPadding: string };

type Story = StoryObj<typeof QueueControlInputBox>;

const meta: Meta<typeof QueueControlInputBox> = {
  title: 'Components/ControlInputBox',
  component: QueueControlInputBox,
  parameters: {},
  argTypes: {
    margin: { label: { control: 'text' } },
    padding: { label: { control: 'text' } },
    inputPadding: { label: { control: 'text' } },
    color: {
      control: { type: 'select' },
      options: ['grey'],
    },
    variant: {
      control: { type: 'select' },
      options: ['outline', 'filled', 'standard'],
    },
    unit: {
      control: { type: 'select' },
      options: ['percent', 'degree', 'pt'],
    },
    width: { label: { control: 'text' } },
    maxValue: { even: { control: { type: 'number' } } },
    minValue: { even: { control: { type: 'number' } } },
    prefixType: {
      // 안보이는 조건 필요
      control: { type: 'select' },
      options: ['img', 'svg', 'class'],
    },
    prefixValue: { label: { control: 'text' } }, // 안보이는 조건 필요
  },
};

export const Primary: Story = {
  render: (args: Partial<allProps>) => {
    const [output, setOutput] = useState<number>(0);
    const {
      variant,
      padding,
      inputPadding,
      color,
      unit,
      margin,
      width,
      maxValue,
      minValue,
    } = args;

    return (
      <div>
        <QueueControlInputBox.Wrapper
          color={color}
          variant={variant}
          padding={padding}
          margin={margin}
          width={width}>
          <QueueControlInputBox.InputBox
            unit={unit}
            padding={inputPadding}
            maxValue={maxValue}
            minValue={minValue}
            valueChangeEvent={(e) => {
              setOutput(e);
            }}></QueueControlInputBox.InputBox>
        </QueueControlInputBox.Wrapper>
        <div>
          <h2>input에 들어온 값: {output}</h2>
          <p>
            output이 유효하지 않은 숫자(범위 이탈, 숫자아님)인 경우, 이전에
            유효했던 값으로 변경됩니다.
          </p>
          <span>ArrowUp, ArrowDown으로 숫자조절 가능</span>
        </div>
      </div>
    );
  },
  args: {
    variant: 'filled',
    padding: '4px',
    color: 'grey',
    unit: 'percent',
    margin: '4px',
    width: '100px',
    maxValue: 100,
    minValue: 0,
    inputPadding: '4px',
  },
};

Primary.storyName = 'prefix X';

export const Secondary: Story = {
  render: (args: Partial<allProps>) => {
    const [output, setOutput] = useState<number>(0);
    const {
      variant,
      padding,
      inputPadding,
      color,
      unit,
      margin,
      width,
      maxValue,
      minValue,
      prefixType,
      prefixValue,
    } = args;

    return (
      <div>
        <QueueControlInputBox.Wrapper
          color={color}
          variant={variant}
          padding={padding}
          margin={margin}
          width={width}>
          <QueueControlInputBox.PrefixIcon
            prefixType={prefixType}
            prefixValue={prefixValue}></QueueControlInputBox.PrefixIcon>
          <QueueControlInputBox.InputBox
            unit={unit}
            padding={inputPadding}
            maxValue={maxValue}
            minValue={minValue}
            valueChangeEvent={(e) => {
              setOutput(e);
            }}></QueueControlInputBox.InputBox>
        </QueueControlInputBox.Wrapper>
        <div>
          <h2>input에 들어온 값: {output}</h2>
          <p>
            output이 유효하지 않은 숫자(범위 이탈, 숫자아님)인 경우, 이전에
            유효했던 값으로 변경됩니다.
          </p>
          <span>ArrowUp, ArrowDown으로 숫자조절 가능</span>
        </div>
      </div>
    );
  },
  args: {
    variant: 'filled',
    padding: '4px',
    color: 'grey',
    unit: 'percent',
    margin: '4px',
    width: '100px',
    prefixType: 'img',
    prefixValue: 'type',
    maxValue: 100,
    minValue: 0,
    inputPadding: '4px',
  },
};

Primary.storyName = 'prefix O';

export default meta;
