import { QueueText } from '@legacy/model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingSelectors } from '@legacy/store/settings';
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
import { Box, IconButton, Select, Separator, Text, TextField } from '@radix-ui/themes';

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
    <div className="tw-flex tw-flex-col">

      <Text size="2">
        {t('global.text')}
      </Text>

      <Select.Root
        size="1"
        value={fontFamily}
        onValueChange={(value): void => updateText({ fontFamily: value })}>
        <Select.Trigger className='tw-w-full tw-mt-2' />
        <Select.Content>
          <Select.Item value="Arial">Arial</Select.Item>
          <Select.Item value="Inter">Inter</Select.Item>
          <Select.Item value="Roboto">Roboto</Select.Item>
        </Select.Content>
      </Select.Root>

      <div className="tw-flex tw-gap-2 tw-mt-2">
        <Select.Root
          disabled
          size="1"
          value="Bold">
          <Select.Trigger className='tw-w-1/2' />
          <Select.Content>
            <Select.Item value="Bold">Bold</Select.Item>
          </Select.Content>
        </Select.Root>
        <TextField.Root
          className='tw-w-1/2'
          size="1"
          type="number"
          value={fontSize}
          onChange={(e): void =>
            updateText({ fontSize: Number(e.target.value) })
          } />
      </div>

      <div className="tw-flex tw-justify-center tw-gap-6 tw-mt-2">
        <IconButton variant='soft' size="2" disabled>
          <RiBold size={16} />
        </IconButton>
        <IconButton variant='soft' size="2" disabled>
          <RiItalic size={16} />
        </IconButton>
        <IconButton variant='soft' size="2" disabled>
          <RiUnderline size={16} />
        </IconButton>
        <IconButton variant='soft' size="2" disabled>
          <RiStrikethrough size={16} />
        </IconButton>
      </div>

      <Separator size="4" className='tw-my-4' />

      <Text size="2">
        Text Align
      </Text>

      <div className="tw-flex tw-justify-center tw-gap-6 tw-mt-2">
        {textHorizontalAlignButtonGroup.map((button) => (
          <IconButton
            key={`textHorizontalAlignButtonGroup-${button.value}`}
            variant={'soft'}
            size="2"
            onClick={() => {
              updateText({ horizontalAlign: button.value });
            }}>
            {button.icon}
          </IconButton>
        ))}
      </div>

      <div className="tw-flex tw-justify-center tw-gap-6 tw-mt-2">
        {textVerticalAlignButtonGroup.map((button) => (
          <IconButton
            key={`textVerticalAlignButtonGroup-${button.value}`}
            variant={'soft'}
            size="2"
            onClick={() => {
              updateText({ verticalAlign: button.value });
            }}>
            {button.icon}
          </IconButton>
        ))}
      </div>

      <Separator size="4" className='tw-my-4' />

      <Text size="2">
        {t('global.color')}
      </Text>

      <div className="tw-flex-1 tw-basis-full tw-mt-2">
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
