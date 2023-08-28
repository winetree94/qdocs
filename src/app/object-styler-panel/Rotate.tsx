import { Slider } from 'components';
import { QueueRotate } from 'model/property';
import { useTranslation } from 'react-i18next';
import { HistoryActions } from 'store/history';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ObjectActions } from 'store/object';
import { SettingSelectors } from 'store/settings';

export const ObjectStyleRotate = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const [firstObject] = selectedObjects;

  const rotate = firstObject.rotate;

  const updateStroke = (rotate: Partial<QueueRotate>): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            rotate: {
              ...object.rotate,
              ...rotate,
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
          {t('global.rotation')}
        </h2>
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <Slider
          min={0}
          max={360}
          value={[rotate.degree]}
          step={0.05}
          onValueChange={([e]) =>
            updateStroke({
              degree: e,
            })
          }
        />
      </div>
    </div>
  );
};
