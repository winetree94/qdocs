import { Slider } from 'components/slider';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { effectSlice, getEffectEntityKey, NormalizedQueueEffect } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';

export type EffectControllerDurationProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerDuration = ({ effectType }: EffectControllerDurationProps): ReactElement => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const effect = useAppSelector((state) =>
    EffectSelectors.byId(
      state,
      getEffectEntityKey({
        index: settings.queueIndex,
        objectId: settings.selectedObjectUUIDs[0],
        type: effectType,
      }),
    ),
  );

  const firstObjectEffect = effect;
  const convertedDuration = firstObjectEffect.duration / 1000;

  const handleDurationChange = (durationValue: number | number[] | string): void => {
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
      const nextEffect: NormalizedQueueEffect = {
        ...effect,
        duration: duration * 1000,
      };

      dispatch(
        effectSlice.actions.upsertEffect({
          ...nextEffect,
          objectId: objectUUID,
          index: settings.queueIndex,
        }),
      );
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
