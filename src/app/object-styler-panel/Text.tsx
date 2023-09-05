import { SvgRemixIcon, SvgRemixIconProps } from 'cdk/icon/SvgRemixIcon';
import { QueueInput } from 'components/input/Input';
import { QueueText } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import { QueueSelect } from 'components/select/Select';
import QueueButtonGroup from 'components/buttons/button-group/ButtonGroup';
import { QueueButton } from 'components/buttons/button/Button';
import { QueueSeparator } from 'components/separator/Separator';
import { QUEUE_UI_COLOR } from 'styles/ui/Color';
import QueueColorPicker from 'components/color-picker/ColorPicker';
import { store } from 'store';

const textHorizontalAlignButtonGroup: {
  value: 'left' | 'center' | 'right' | 'justify';
  icon: SvgRemixIconProps['icon'];
}[] = [
  {
    value: 'left',
    icon: 'ri-align-left',
  },
  {
    value: 'center',
    icon: 'ri-align-center',
  },
  {
    value: 'right',
    icon: 'ri-align-right',
  },
  {
    value: 'justify',
    icon: 'ri-align-justify',
  },
];

const textVerticalAlignButtonGroup: {
  value: 'top' | 'middle' | 'bottom';
  icon: SvgRemixIconProps['icon'];
}[] = [
  {
    value: 'top',
    icon: 'ri-align-top',
  },
  {
    value: 'middle',
    icon: 'ri-align-vertically',
  },
  {
    value: 'bottom',
    icon: 'ri-align-bottom',
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
            <SvgRemixIcon icon="ri-bold" />
          </QueueButton>
          <QueueButton className="tw-w-full" disabled>
            <SvgRemixIcon icon="ri-italic" />
          </QueueButton>
          <QueueButton className="tw-w-full" disabled>
            <SvgRemixIcon icon="ri-underline" />
          </QueueButton>
          <QueueButton className="tw-w-full" disabled>
            <SvgRemixIcon icon="ri-strikethrough" />
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
              <SvgRemixIcon icon={button.icon} />
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
              <SvgRemixIcon icon={button.icon} />
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
