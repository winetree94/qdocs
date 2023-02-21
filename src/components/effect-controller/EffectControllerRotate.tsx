import { RotateEffect } from 'model/effect';
import { QueueRotate } from 'model/property';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setObjectQueueEffects } from 'store/document/actions';
import { selectObjectQueueEffects } from 'store/document/selectors';
import { selectSettings } from 'store/settings/selectors';

export const EffectControllerRotate = (): ReactElement => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const effects = useSelector(selectObjectQueueEffects(settings.queuePage, settings.queueIndex));

  const firstObjectRotateEffect =
    effects[settings.selectedObjectUUIDs[0]].rotate;

  const handleCurrentRotateChange = (rotate: Partial<QueueRotate>): void => {
    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect: RotateEffect = {
        ...effects[objectUUID].rotate,
        index: settings.queueIndex,
        rotate: {
          ...effects[objectUUID].rotate.rotate,
          ...rotate,
        },
      };

      dispatch(setObjectQueueEffects({
        page: settings.queuePage,
        queueIndex: settings.queueIndex,
        effects: {
          ...effects,
          [objectUUID]: {
            ...effects[objectUUID],
            rotate: nextEffect,
          },
        }
      }));
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
          value={firstObjectRotateEffect.rotate.degree}
          onChange={(e): void => {
            handleCurrentRotateChange({ degree: parseInt(e.target.value) });
          }}
        />
      </div>
    </div>
  );
};
