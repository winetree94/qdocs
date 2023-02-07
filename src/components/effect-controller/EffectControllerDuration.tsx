import { debounce } from 'cdk/functions/debounce';
import { useQueueDocument } from 'cdk/hooks/useQueueDocument';
import { useSettings } from 'cdk/hooks/useSettings';
import { Slider } from 'components/slider';
import { QueueEffectType } from 'model/effect';
import { ReactElement, useCallback, useMemo, useState } from 'react';

// uuid, effectType만 필요할듯
export const EffectControllerDuration = ({
  uuid,
  effect,
}: {
  uuid: string;
  effect: QueueEffectType;
}): ReactElement => {
  const { settings } = useSettings();
  const { queueDocument, selectedObjects, ...setQueueDocument } =
    useQueueDocument();
  const [firstObject] = selectedObjects;
  const firstObjectCurrentEffect = firstObject.effects.find(
    (firstObjectEffect) =>
      firstObjectEffect.type === effect.type &&
      firstObjectEffect.index === settings.queueIndex
  );

  const [duration, setDuration] = useState([
    firstObjectCurrentEffect.duration / 1000,
  ]);

  // debounce가 의도한대로 동작하지 않는 문제
  const debouncedUpdateEffect = useMemo(
    () =>
      debounce((duration: number) => {
        console.log('냐냥이?1');
        setQueueDocument.updateObjectProp(settings.queuePage, [
          {
            uuid,
            queueIndex: settings.queueIndex,
            props: {
              [effect.type]: {
                ...effect,
                duration,
              },
            },
          },
        ]);
      }, 500),
    [setQueueDocument, settings.queuePage, settings.queueIndex, effect, uuid]
  );

  const handleDurationChange = useCallback(
    (duration: number) => debouncedUpdateEffect(duration),
    [debouncedUpdateEffect]
  );

  return (
    <div>
      <p className="text-sm">duration</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          name="duration"
          value={duration[0] * 1000}
          readOnly
          hidden
        />
        <div className="w-5/12">
          <input
            className="w-full"
            type="number"
            step={0.1}
            value={duration[0]}
            onChange={(e): void => {
              const duration = parseFloat(e.currentTarget.value);
              setDuration([duration]);
              handleDurationChange(duration * 1000);
            }}
          />
        </div>
        <div className="flex items-center w-full">
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={duration}
            onValueChange={(value): void => {
              setDuration(value);
              handleDurationChange(value[0] * 1000);
            }}
          />
        </div>
      </div>
    </div>
  );
};
