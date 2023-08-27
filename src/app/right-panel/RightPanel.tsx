import { useState, ChangeEvent } from 'react';
import { QueueControlInputBoxComponent } from 'components/control-input-box/components';
import QueueButtonGroup from 'components/buttons/button-group/ButtonGroup';
import { QueueButton } from 'components/buttons/button/Button';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import QueueCheckbox from 'components/buttons/checkbox/Checkbox';
import QueueTab from 'components/tabs/Tab';
import { LeftPanel } from 'app/left-panel/LeftPanel';
import QueueRadioGroup from '../../components/buttons/radio/RadioGroup';
import { QueueRadioProps } from '../../components/buttons/radio/Radio.model';
import { useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings';
import { supportImageAll, supportRectAll } from 'model/support';
import { DefaultPropPanel } from 'app/left-panel/default-prop-panel/DefaultPropPanel';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface RightPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hello?: 'world';
}

const inputValueChanges = (e: number) => {
  // console.log('inputValueChanges e: ', e);
};

export const RightPanel = ({ className, ...props }: RightPanelProps) => {
  const { t } = useTranslation();
  const objects = useAppSelector(SettingSelectors.selectedObjects);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

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
    {
      id: 'id3',
      name: 'testData',
      value: 'testValue3',
      checked: true,
      checkboxColor: QUEUE_UI_COLOR.RED,
    },
  ];

  const testRadioData: QueueRadioProps[] = [
    {
      id: 'id1-1',
      name: 'testDataRadio',
      value: 'testValue1testValue1testValue1',
      label: 'testValue1testValue1testValue1',
      checked: true,
      radioColor: QUEUE_UI_COLOR.DEFAULT,
      radioOnChange: (e) => {
        console.log(e.target.value);
      },
    },
    {
      id: 'id2-2',
      name: 'testDataRadio',
      value: 'testValue2',
      label: 'testValue2',
      checked: false,
      disabled: true,
      radioColor: QUEUE_UI_COLOR.BLUE,
      radioOnChange: (e) => {
        console.log(e.target.value);
      },
    },
    {
      id: 'id3-3',
      name: 'testDataRadio',
      value: 'testValue3',
      label: 'testValue3',
      checked: false,
      radioColor: QUEUE_UI_COLOR.RED,
      radioOnChange: (e) => {
        console.log(e.target.value);
      },
    },
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
    <div
      className={clsx(
        'tw-border-y',
        'tw-border-l',
        'tw-border-[var(--gray-5)]',
        'tw-rounded-l-[20px]',
        'tw-bg-[var(--gray-1)]',
        className,
      )}
      {...props}>
      <QueueTab
        className="tw-h-full"
        defaultValue="obj 추가(임시)"
        tabs={[
          {
            name: t('global.design'),
            content: (
              <div className="tw-h-[calc(100%-46px)]">
                {selectedObjects.length > 0 ? <DefaultPropPanel /> : <div />}
              </div>
            ),
          },
          {
            name: 'obj 추가(임시)',
            content: (
              <>
                <LeftPanel />
                <div className="tw-flex">
                  {supportImageAll(objects) && (
                    <div>
                      <div>Image 지원</div>
                      <div>{objects[0]?.image?.alt}</div>
                    </div>
                  )}

                  {supportRectAll(objects) && (
                    <div>
                      <div>Rect 지원</div>
                      <div>{objects[0]?.rect?.height}</div>
                    </div>
                  )}

                  <QueueControlInputBoxComponent.Wrapper
                    color="grey"
                    variant="filled">
                    <QueueControlInputBoxComponent.InputBox
                      unit="percent"
                      valueChangeEvent={inputValueChanges}
                      {...props}></QueueControlInputBoxComponent.InputBox>
                  </QueueControlInputBoxComponent.Wrapper>

                  <QueueControlInputBoxComponent.Wrapper
                    color="grey"
                    variant="filled">
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
                    checkBoxOnChange={checkboxOnChange}>
                    {option.value}
                  </QueueCheckbox>
                ))}
                <QueueRadioGroup radioData={testRadioData}></QueueRadioGroup>
              </>
            ),
          },
        ]}></QueueTab>
    </div>
  );
};
