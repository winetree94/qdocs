/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSettings } from 'cdk/hooks/useSettings';
import { Slider } from 'components/slider';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { objectQueueEffects } from 'store/effects';
// import { objectCurrentEffects } from 'store/effects';
import { currentQueueObjects } from 'store/object';

// uuid, effectType만 필요할듯
export const EffectControllerDuration = (): ReactElement => {
  const { settings } = useSettings();

  const [effects, setEffects] = useRecoilState(objectQueueEffects({
    pageIndex: settings.queuePage,
    queueIndex: settings.queueIndex,
  }));

  const selectedObjects = useRecoilValue(
    currentQueueObjects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  ).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));

  // const objectBaseEffects = useRecoilValue(
  //   objectCurrentEffects({
  //     pageIndex: settings.queuePage,
  //     queueIndex: settings.queueIndex,
  //     uuid: settings.selectedObjectUUIDs,
  //   })
  // );

  const [firstObject] = selectedObjects;
  // const firstObjectRectEffect = objectBaseEffects[firstObject.uuid];

  // const handleCurrentEffectDurationChange = (
  //   duration: number | number[] | string
  // ): void => {
  //   console.log(duration);
  // };

  // console.log(firstObjectRectEffect);

  return (
    <div>
      <p className="text-sm">duration</p>
      <div className="flex items-center gap-2">
        <div className="w-5/12">
          <input
            className="w-full"
            type="number"
            step={0.1}
          // value={firstObjectRectEffect.duration}
          // onChange={(e): void =>
          //   handleCurrentEffectDurationChange(e.currentTarget.value)
          // }
          />
        </div>
        <div className="flex items-center w-full">
          <Slider
            min={0}
            max={10}
            step={0.1}
          // value={[firstObjectRectEffect.duration * 1000]}
          // onValueChange={(duration): void =>
          //   handleCurrentEffectDurationChange(duration)
          // }
          />
        </div>
      </div>
    </div>
  );
};
