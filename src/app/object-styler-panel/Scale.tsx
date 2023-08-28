import { Slider } from 'components';
import { QueueScale } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';

export const ObjectStyleScale = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const scale = firstObject.scale;

  const updateStroke = (scale: Partial<QueueScale>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            scale: {
              ...object.scale,
              ...scale,
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
          {t('global.scale')}
        </h2>
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <Slider
          min={0}
          max={5}
          value={[scale.scale]}
          step={0.05}
          onValueChange={([e]) =>
            updateStroke({
              scale: e,
            })
          }
        />
      </div>
    </div>
  );
};
