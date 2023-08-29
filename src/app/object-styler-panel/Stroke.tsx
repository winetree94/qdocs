import { Slider } from 'components';
import { QueueStroke } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';
import { QueueSelect } from 'components/select/Select';
import { supportStrokeAll } from 'model/support';
import QueueColorPicker from 'components/color-picker/ColorPicker';

export const ObjectStyleStroke = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  if (!supportStrokeAll(selectedObjects)) {
    return <></>;
  }

  const [firstObject] = selectedObjects;

  const stroke = firstObject.stroke;

  const updateStroke = (stroke: Partial<QueueStroke>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
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
          min={0}
          max={50}
          value={[stroke.width]}
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
            color={stroke.color}
            onChange={(color) => {
              updateStroke({ color: color.hex });
            }}
          />
          <div>{stroke.color.replace('#', '')}</div>
        </div>
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <QueueSelect
          value={stroke.dasharray}
          onValueChange={(value): void => updateStroke({ dasharray: value })}>
          <QueueSelect.Option value="solid">-------</QueueSelect.Option>
          <QueueSelect.Option value="dashed">- - - -</QueueSelect.Option>
          <QueueSelect.Option value="longDashed">-- -- --</QueueSelect.Option>
        </QueueSelect>
      </div>
    </div>
  );
};
