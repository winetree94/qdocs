import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useSettings } from 'cdk/hooks/useSettings';
import { QueueSelect } from 'components/select/Select';
import { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { objectCurrentEffects } from 'store/effects';
import { currentQueueObjects } from 'store/object';

export const EffectControllerTimingFunction = (): ReactElement => {
  const { settings } = useSettings();

  const selectedObjects = useRecoilValue(
    currentQueueObjects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  ).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));

  const objectBaseEffects = useRecoilValue(
    objectCurrentEffects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
      uuid: settings.selectedObjectUUIDs,
    })
  );

  const [firstObject] = selectedObjects;
  const firstObjectRectEffect = objectBaseEffects[firstObject.uuid];

  // const handleTimingFunctionChange = (
  //   timingFunction: string
  // ): void => {
  //   console.log(timingFunction);
  // };

  console.log(firstObjectRectEffect);

  return (
    <div>
      <p className="text-sm">timing function</p>
      <QueueSelect.Root
      // defaultValue={firstObjectRectEffect.timing}
      // onValueChange={handleTimingFunctionChange}
      >
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
