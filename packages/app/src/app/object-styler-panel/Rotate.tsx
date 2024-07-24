import { QueueSlider } from '@legacy/components/slider/Slider';
import { QueueRotate } from '@legacy/model/property';
import { useTranslation } from 'react-i18next';
import { store } from 'store';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingSelectors } from '@legacy/store/settings';

export const ObjectStyleRotate = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { degree } = useAppSelector(
    SettingSelectors.firstSelectedObjectRotation,
    (prev, next) => {
      return prev.degree === next.degree;
    },
  );

  const updateStroke = (rotate: Partial<QueueRotate>): void => {
    const selectedObjects = SettingSelectors.selectedObjects(store.getState());
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
        <QueueSlider
          min={0}
          max={360}
          value={[degree]}
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
