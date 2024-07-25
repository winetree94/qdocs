import { QueueInput } from '@legacy/components/input/Input';
import { QueueText } from '@legacy/model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingSelectors } from '@legacy/store/settings';
import { QueueSelect } from '@legacy/components/select/Select';
import QueueButtonGroup from '@legacy/components/buttons/button-group/ButtonGroup';
import { QueueButton } from '@legacy/components/buttons/button/Button';
import { QueueSeparator } from '@legacy/components/separator/Separator';
import { QUEUE_UI_COLOR } from '@legacy/styles/ui/Color';
import QueueColorPicker from '@legacy/components/color-picker/ColorPicker';
import { store } from '@legacy/store';
import {
  RiAlignBottom,
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiAlignTop,
  RiAlignVertically,
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiUnderline,
} from '@remixicon/react';
import React from 'react';

const textHorizontalAlignButtonGroup: {
  value: 'left' | 'center' | 'right' | 'justify';
  icon: React.ReactElement;
}[] = [
  {
    value: 'left',
    icon: <RiAlignLeft size={16} />,
  },
  {
    value: 'center',
    icon: <RiAlignCenter size={16} />,
  },
  {
    value: 'right',
    icon: <RiAlignRight size={16} />,
  },
  {
    value: 'justify',
    icon: <RiAlignJustify size={16} />,
  },
];

const textVerticalAlignButtonGroup: {
  value: 'top' | 'middle' | 'bottom';
  icon: React.ReactElement;
}[] = [
  {
    value: 'top',
    icon: <RiAlignTop size={16} />,
  },
  {
    value: 'middle',
    icon: <RiAlignVertically size={16} />,
  },
  {
    value: 'bottom',
    icon: <RiAlignBottom size={16} />,
  },
];

export const ObjectStyleText = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { fontFamily, fontSize, horizontalAlign, verticalAlign, fontColor } =
    useAppSelector(SettingSelectors.firstSelectedObjectText, (prev, next) => {
      return (
        prev.fontFamily === next.fontFamily &&
        prev.fontSize === next.fontSize &&
        prev.horizontalAlign === next.horizontalAlign &&
        prev.verticalAlign === next.verticalAlign &&
        prev.fontColor === next.fontColor
      );
    });

  const updateText = (text: Partial<QueueText>): void => {
    const selectedObjects = SettingSelectors.selectedObjects(store.getState());
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            text: {
              ...object.text,
              ...text,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className="tw-flex tw-flex-wrap tw-gap-2">
      <div className="tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
          {t('global.text')}
        </h2>
      </div>
      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <QueueSelect
          value={fontFamily}
          onValueChange={(value): void => updateText({ fontFamily: value })}>
          <QueueSelect.Group>
            <QueueSelect.Option value="Arial">Arial</QueueSelect.Option>
            <QueueSelect.Option value="Inter">Inter</QueueSelect.Option>
            <QueueSelect.Option value="Roboto">Roboto</QueueSelect.Option>
          </QueueSelect.Group>
        </QueueSelect>
      </div>
      <div className="tw-flex-1">
        <QueueSelect value="Bold" disabled>
          <QueueSelect.Option value="Bold">Bold</QueueSelect.Option>
        </QueueSelect>
      </div>
      <div className="tw-flex-1">
        <QueueInput
          value={fontSize}
          type="number"
          variant="filled"
          onChange={(e): void =>
            updateText({ fontSize: Number(e.target.value) })
          }
        />
      </div>

      <div className="tw-flex-1 tw-basis-full">
        <QueueButtonGroup>
          <QueueButton className="tw-w-full" disabled>
            <RiBold size={16} />
          </QueueButton>
          <QueueButton className="tw-w-full" disabled>
            <RiItalic size={16} />
          </QueueButton>
          <QueueButton className="tw-w-full" disabled>
            <RiUnderline size={16} />
          </QueueButton>
          <QueueButton className="tw-w-full" disabled>
            <RiStrikethrough size={16} />
          </QueueButton>
        </QueueButtonGroup>
      </div>

      <QueueSeparator.Root className="tw-my-2" />

      <div className="tw-flex-1 tw-basis-full">
        <QueueButtonGroup>
          {textHorizontalAlignButtonGroup.map((button) => (
            <QueueButton
              className="tw-w-full tw-max-w-[50px] tw-box-border"
              data-state={horizontalAlign === button.value && 'on'}
              color={QUEUE_UI_COLOR.DEFAULT}
              key={`textHorizontalAlignButtonGroup-${button.value}`}
              onClick={() => {
                updateText({ horizontalAlign: button.value });
              }}>
              {button.icon}
            </QueueButton>
          ))}
        </QueueButtonGroup>
      </div>

      <div className="tw-flex-1 tw-basis-full">
        <QueueButtonGroup>
          {textVerticalAlignButtonGroup.map((button) => (
            <QueueButton
              className="tw-w-full tw-max-w-[50px] tw-box-border"
              data-state={verticalAlign === button.value && 'on'}
              color={QUEUE_UI_COLOR.DEFAULT}
              key={`textVerticalAlignButtonGroup-${button.value}`}
              onClick={() => {
                updateText({ verticalAlign: button.value });
              }}>
              {button.icon}
            </QueueButton>
          ))}
        </QueueButtonGroup>
      </div>

      <QueueSeparator.Root className="tw-my-2" />

      <div className="tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
          {t('global.color')}
        </h2>
      </div>
      <div className="tw-flex-1 tw-basis-full">
        <div className="tw-flex tw-gap-2 tw-items-center tw-px-2 tw-py-1.5 tw-box-border tw-bg-[#E7E6EB] tw-leading-none tw-text-xs tw-font-normal tw-rounded-lg">
          <QueueColorPicker
            color={fontColor}
            onChange={(color) => {
              updateText({ fontColor: color.hex });
            }}
          />
          <div>{fontColor.replace('#', '')}</div>
        </div>
      </div>
    </div>
  );
};
