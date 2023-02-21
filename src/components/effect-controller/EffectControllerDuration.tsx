import { Slider } from 'components/slider';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setObjectQueueEffects } from 'store/document/actions';
import { ObjectQueueEffects, selectObjectQueueEffects, selectQueueObjects } from 'store/document/selectors';
import { selectSettings } from 'store/settings/selectors';

export type EffectControllerDurationProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerDuration = ({
  effectType,
}: EffectControllerDurationProps): ReactElement => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const effects = useSelector(selectObjectQueueEffects(settings.queuePage, settings.queueIndex));
  const selectedObjects = useSelector(selectQueueObjects(settings.queuePage, settings.queueIndex)).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));
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

      dispatch(setObjectQueueEffects({
        page: settings.queuePage,
        queueIndex: settings.queueIndex,
        effects: {
          ...effects,
          [objectUUID]: {
            ...effects[objectUUID],
            [effectType]: nextEffect,
          },
        }
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
