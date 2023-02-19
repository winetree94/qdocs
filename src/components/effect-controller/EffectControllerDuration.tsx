import { Slider } from 'components/slider';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ObjectQueueEffects, objectQueueEffects } from 'store/effects';
import { queueObjects } from 'store/object';
import { documentSettingsState } from 'store/settings';

export type EffectControllerDurationProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerDuration = ({
  effectType,
}: EffectControllerDurationProps): ReactElement => {
  const settings = useRecoilValue(documentSettingsState);

  const [effects, setEffects] = useRecoilState(
    objectQueueEffects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  );

  const selectedObjects = useRecoilValue(
    queueObjects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  ).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));
  const [firstSelectedObject] = selectedObjects;

  const firstObjectEffect = effects[firstSelectedObject.uuid][effectType];
  const convertedDuration = firstObjectEffect.duration / 1000;

  const handleDurationChange = (
    durationValue: number | number[] | string
  ): void => {
    let duration = 1000;

    if (typeof durationValue === 'number') {
      duration = durationValue;
    }

    if (Array.isArray(durationValue)) {
      duration = durationValue[0];
    }

    if (typeof durationValue === 'string') {
      duration = parseFloat(durationValue);
    }

    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect: ObjectQueueEffects[QueueEffectType['type']] = {
        ...effects[objectUUID][effectType],
        duration: duration * 1000,
      };

      setEffects((prevEffects) => ({
        ...prevEffects,
        [objectUUID]: {
          ...prevEffects[objectUUID],
          [effectType]: nextEffect,
        },
      }));
    });
  };

  return (
    <div>
      <p className="text-sm">duration</p>
      <div className="flex items-center gap-2">
        <div className="w-5/12">
          <input
            className="w-full"
            type="number"
            step={0.1}
            value={convertedDuration}
            onChange={(e): void => handleDurationChange(e.currentTarget.value)}
          />
        </div>
        <div className="flex items-center w-full">
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={[convertedDuration]}
            onValueChange={(duration): void => handleDurationChange(duration)}
          />
        </div>
      </div>
    </div>
  );
};
