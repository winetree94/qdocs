import { Slider } from 'components/slider';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { getEffectEntityKey } from 'store/effect/reducer';
import { EffectSelectors } from 'store/effect/selectors';
import { EffectActions, NormalizedQueueEffect } from '../../store/effect';

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
        objectId: settings.selectedObjectIds[0],
        type: effectType,
      }),
    ),
  );

  const firstObjectEffect = effect;
  const convertedDuration = firstObjectEffect.duration / 1000;
  const convertedDealy = firstObjectEffect.delay / 1000;

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

    settings.selectedObjectIds.forEach((objectId) => {
      const nextEffect: NormalizedQueueEffect = {
        ...effect,
        duration: duration * 1000,
      };

      dispatch(
        EffectActions.upsertEffect({
          ...nextEffect,
          objectId: objectId,
          index: settings.queueIndex,
        }),
      );
    });
  };

  const handleDelayChange = (delayValue: number | number[] | string): void => {
    let delay = 1000;

    if (typeof delayValue === 'number') {
      delay = delayValue;
    }

    if (Array.isArray(delayValue)) {
      delay = delayValue[0];
    }

    if (typeof delayValue === 'string') {
      delay = parseFloat(delayValue);
    }

    settings.selectedObjectIds.forEach((objectId) => {
      const nextEffect: NormalizedQueueEffect = {
        ...effect,
        delay: delay * 1000,
      };

      dispatch(
        EffectActions.upsertEffect({
          ...nextEffect,
          objectId: objectId,
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
      <p className="text-sm">delay</p>
      <div className="flex items-center gap-2">
        <div className="w-5/12">
          <input
            className="w-full"
            type="number"
            step={0.1}
            value={convertedDealy}
            onChange={(e): void => handleDelayChange(e.currentTarget.value)}
          />
        </div>
        <div className="flex items-center w-full">
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={[convertedDealy]}
            onValueChange={(duration): void => handleDelayChange(duration)}
          />
        </div>
      </div>
    </div>
  );
};
