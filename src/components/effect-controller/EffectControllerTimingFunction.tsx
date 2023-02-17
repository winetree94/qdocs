import { ChevronDownIcon } from '@radix-ui/react-icons';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { useSettings } from 'cdk/hooks/useSettings';
import { QueueSelect } from 'components/select/Select';
import { BaseQueueEffect } from 'model/effect';
import { ReactElement } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { objectCurrentBasesEffect } from 'store/effects/base';
import { currentQueueObjects } from 'store/object';

export const EffectControllerTimingFunction = (): ReactElement => {
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

  const handleTimingFunctionChange = (timingFunction: string): void => {
    const updateModel = settings.selectedObjectUUIDs.reduce<{
      [key: string]: BaseQueueEffect;
    }>((result, uuid) => {
      result[uuid] = {
        ...objectBaseEffects[uuid],
        timing: timingFunction as AnimatorTimingFunctionType,
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
      <p className="text-sm">timing function</p>
      <QueueSelect.Root
        defaultValue={firstObjectBaseEffect.timing}
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
