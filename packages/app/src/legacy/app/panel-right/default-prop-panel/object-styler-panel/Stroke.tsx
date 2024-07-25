import { QueueStroke } from '@legacy/model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingSelectors } from '@legacy/store/settings';
import QueueColorPicker from '@legacy/components/color-picker/ColorPicker';
import { store } from '@legacy/store';
import { supportStroke } from '@legacy/model/support';
import { Select, Slider } from '@radix-ui/themes';

export const ObjectStyleStroke = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { width, color, dasharray } = useAppSelector(
    SettingSelectors.firstSelectedObjectStroke,
    (prev, next) => {
      return (
        prev.width === next.width &&
        prev.color === next.color &&
        prev.dasharray === next.dasharray
      );
    },
  );

  const updateStroke = (stroke: Partial<QueueStroke>): void => {
    const selectedObjects = SettingSelectors.selectedObjects(store.getState());
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.filter(supportStroke).map((object) => ({
          id: object.id,
          changes: {
            stroke: {
              ...object.stroke,
              ...stroke,
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
          {t('global.border')}
        </h2>
      </div>
      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <Slider
          size="1"
          min={0}
          max={50}
          value={[width]}
          onValueChange={([e]) =>
            updateStroke({
              width: e,
            })
          } />
      </div>

      <div className="tw-flex-1 tw-basis-full">
        <div className="tw-flex tw-gap-2 tw-items-center tw-px-2 tw-py-1.5 tw-box-border tw-bg-[#E7E6EB] tw-leading-none tw-text-xs tw-font-normal tw-rounded-lg">
          <QueueColorPicker
            color={color}
            onChange={(color) => {
              updateStroke({ color: color.hex });
            }}
          />
          <div>{color.replace('#', '')}</div>
        </div>
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <Select.Root
          size="1"
          value={dasharray}
          onValueChange={(value): void => updateStroke({ dasharray: value })}>
          <Select.Trigger className='tw-w-full' />
          <Select.Content>
            <Select.Item value="solid">-------</Select.Item>
            <Select.Item value="dashed">- - - -</Select.Item>
            <Select.Item value="longDashed">-- -- --</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
};
