import { RotateEffect } from 'model/effect';
import { QueueRotate } from 'model/property';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { objectQueueEffects } from 'store/effects';
import { documentSettingsState } from 'store/settings';

export const EffectControllerRotate = (): ReactElement => {
  const settings = useRecoilValue(documentSettingsState);

  const [effects, setEffects] = useRecoilState(
    objectQueueEffects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  );

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

      setEffects((prevEffects) => ({
        ...prevEffects,
        [objectUUID]: {
          ...prevEffects[objectUUID],
          rotate: nextEffect,
        },
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
