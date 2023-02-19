import { ChevronDownIcon } from '@radix-ui/react-icons';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { QueueSelect } from 'components/select/Select';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ObjectQueueEffects, objectQueueEffects } from 'store/effects';
import { queueObjects } from 'store/object';
import { documentSettingsState } from 'store/settings';

export type EffectControllerTimingFunctionProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerTimingFunction = ({
  effectType,
}: EffectControllerTimingFunctionProps): ReactElement => {
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

  const handleTimingFunctionChange = (timingFunction: string): void => {
    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect: ObjectQueueEffects[QueueEffectType['type']] = {
        ...effects[objectUUID][effectType],
        timing: timingFunction as AnimatorTimingFunctionType,
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
      <p className="text-sm">timing function</p>
      <QueueSelect.Root
        defaultValue={firstObjectEffect.timing}
        onValueChange={handleTimingFunctionChange}>
        <QueueSelect.Trigger>
          <QueueSelect.Value />
          <QueueSelect.Icon>
            <ChevronDownIcon />
          </QueueSelect.Icon>
        </QueueSelect.Trigger>
        <QueueSelect.Portal>
          <QueueSelect.Content>
            <QueueSelect.Viewport>
              <QueueSelect.Item value="linear">linear</QueueSelect.Item>
              <QueueSelect.Item value="ease">ease</QueueSelect.Item>
              <QueueSelect.Item value="ease-in">ease-in</QueueSelect.Item>
            </QueueSelect.Viewport>
          </QueueSelect.Content>
        </QueueSelect.Portal>
      </QueueSelect.Root>
    </div>
  );
};
