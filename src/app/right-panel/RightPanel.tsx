import { useState, ChangeEvent } from 'react';
import { QueueControlInputBoxComponent } from 'components/control-input-box/components';
import QueueButtonGroup from 'components/buttons/button-group/ButtonGroup';
import { QueueButton } from 'components/buttons/button/Button';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import QueueCheckbox from 'components/buttons/checkbox/Checkbox';

export interface RightPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hello?: 'world';
}

const inputValueChanges = (e: number) => {
  // console.log('inputValueChanges e: ', e);
};

export const RightPanel = ({ hello, ...props }: RightPanelProps) => {
  const testCheckboxData = [
    {
      id: 'id1',
      name: 'testData',
      value: 'testValue1testValue1testValue1',
      checked: false,
      checkboxColor: QUEUE_UI_COLOR.DEFAULT,
    },
    {
      id: 'id2',
      name: 'testData',
      value: 'testValue2',
      checked: true,
      disabled: true,
      checkboxColor: QUEUE_UI_COLOR.BLUE,
    },
    { id: 'id3', name: 'testData', value: 'testValue3', checked: true, checkboxColor: QUEUE_UI_COLOR.RED },
  ];

  const [checkboxOptions, setCheckboxOptions] = useState(testCheckboxData);

  const checkboxOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckboxOptions((prev) =>
      prev.map((option) => {
        return {
          ...option,
          checked: option.id === e.target.id ? !option.checked : option.checked,
        };
      }),
    );
  };

  return (
    <>
      <div {...props}>
        우측 패널임
        <div className="tw-flex">
          <QueueControlInputBoxComponent.Wrapper color="grey" variant="filled">
            <QueueControlInputBoxComponent.InputBox
              unit="percent"
              valueChangeEvent={inputValueChanges}
              {...props}></QueueControlInputBoxComponent.InputBox>
          </QueueControlInputBoxComponent.Wrapper>

          <QueueControlInputBoxComponent.Wrapper color="grey" variant="filled">
            <QueueControlInputBoxComponent.PrefixIcon
              prefixType="img"
              prefixValue="type"></QueueControlInputBoxComponent.PrefixIcon>
            <QueueControlInputBoxComponent.InputBox
              unit="percent"
              valueChangeEvent={inputValueChanges}
              {...props}></QueueControlInputBoxComponent.InputBox>
          </QueueControlInputBoxComponent.Wrapper>
        </div>
        <QueueButtonGroup>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.RED}
            onClick={() => console.log(1)}>
            btn1
          </QueueButton>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.BLUE}
            onClick={() => console.log(2)}>
            btn2
          </QueueButton>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.DEFAULT}
            onClick={() => console.log(3)}>
            btn3
          </QueueButton>
          <QueueButton
            type="button"
            size={QUEUE_UI_SIZE.MEDIUM}
            color={QUEUE_UI_COLOR.RED}
            onClick={() => console.log(4)}>
            btn4
          </QueueButton>
        </QueueButtonGroup>
        {checkboxOptions.map((option) => (
          <QueueCheckbox
            key={option.id}
            id={option.id}
            name={option.name}
            value={option.value}
            checked={option.checked}
            disabled={option.disabled}
            checkboxColor={option.checkboxColor}
            checkboxSize={QUEUE_UI_SIZE.LARGE}
            onchange={checkboxOnChange}>
            {option.value}
          </QueueCheckbox>
        ))}
      </div>
    </>
  );
};
