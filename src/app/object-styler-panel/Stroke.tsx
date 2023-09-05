import { QueueStroke } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import { QueueSelect } from 'components/select/Select';
import QueueColorPicker from 'components/color-picker/ColorPicker';
import { QueueSlider } from 'components/slider/Slider';
import { store } from 'store';
import { supportStroke } from 'model/support';

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
        <QueueSlider
          min={0}
          max={50}
          value={[width]}
          onValueChange={([e]) =>
            updateStroke({
              width: e,
            })
          }
        />
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
        <QueueSelect
          value={dasharray}
          onValueChange={(value): void => updateStroke({ dasharray: value })}>
          <QueueSelect.Option value="solid">-------</QueueSelect.Option>
          <QueueSelect.Option value="dashed">- - - -</QueueSelect.Option>
          <QueueSelect.Option value="longDashed">-- -- --</QueueSelect.Option>
        </QueueSelect>
      </div>
    </div>
  );
};
