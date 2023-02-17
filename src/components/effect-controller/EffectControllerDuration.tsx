import { useSettings } from 'cdk/hooks/useSettings';
import { Slider } from 'components/slider';
import { BaseQueueEffect } from 'model/effect';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { objectCurrentBasesEffect } from 'store/effects/base';
import { currentQueueObjects } from 'store/object';

export const EffectControllerDuration = (): ReactElement => {
  const { settings } = useSettings();

  const selectedObjects = useRecoilValue(
    currentQueueObjects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  ).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));

  const [objectBaseEffects, setObjectBaseEffects] = useRecoilState(
    objectCurrentBasesEffect({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
      uuid: settings.selectedObjectUUIDs,
    })
  );

  const [firstObject] = selectedObjects;
  const firstObjectBaseEffect = objectBaseEffects[firstObject.uuid];
  const convertedDuration = firstObjectBaseEffect.duration / 1000;

  const handleTimingFunctionChange = (
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

    const updateModel = settings.selectedObjectUUIDs.reduce<{
      [key: string]: BaseQueueEffect;
    }>((result, uuid) => {
      result[uuid] = {
        ...objectBaseEffects[uuid],
        duration: Math.round(duration * 1000),
      };
      return result;
    }, {});

    setObjectBaseEffects((prev) => ({
      ...prev,
      ...updateModel,
    }));
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
            onChange={(e): void =>
              handleTimingFunctionChange(e.currentTarget.value)
            }
          />
        </div>
        <div className="flex items-center w-full">
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={[convertedDuration]}
            onValueChange={(duration): void =>
              handleTimingFunctionChange(duration)
            }
          />
        </div>
      </div>
    </div>
  );
};
