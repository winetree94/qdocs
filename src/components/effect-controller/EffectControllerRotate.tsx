import { RotateEffect } from 'model/effect';
import { QueueRotate } from 'model/property';
import { ReactElement } from 'react';
import { selectObjectQueueEffects } from 'store/legacy/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { objectsSlice } from 'store/object/object.reducer';
import { SettingSelectors } from 'store/settings/selectors';

export const EffectControllerRotate = (): ReactElement => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const effects = useAppSelector(selectObjectQueueEffects(settings.queuePage, settings.queueIndex));

  const firstObjectRotateEffect = effects[settings.selectedObjectUUIDs[0]].rotate;

  const handleCurrentRotateChange = (rotate: Partial<QueueRotate>): void => {
    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect: RotateEffect = {
        ...effects[objectUUID].rotate,
        index: settings.queueIndex,
        prop: {
          ...effects[objectUUID].rotate.prop,
          ...rotate,
        },
      };

      dispatch(
        objectsSlice.actions.setObjectQueueEffects({
          page: settings.queuePage,
          queueIndex: settings.queueIndex,
          effects: {
            ...effects,
            [objectUUID]: {
              ...effects[objectUUID],
              rotate: nextEffect,
            },
          },
        }),
      );
    });
  };

  return (
    <div>
      <p className="text-sm">rotation</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full"
          type="number"
          step={5}
          value={firstObjectRotateEffect.prop.degree}
          onChange={(e): void => {
            handleCurrentRotateChange({ degree: parseInt(e.target.value) });
          }}
        />
      </div>
    </div>
  );
};
