import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useQueueDocument } from 'cdk/hooks/useQueueDocument';
import { useSettings } from 'cdk/hooks/useSettings';
import { QueueSelect } from 'components/select/Select';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';

export const EffectControllerTimingFunction = ({
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

  const handleTimingFunctionChange = (value: string): void => {
    console.log(value);
    setQueueDocument.updateObjectProp(settings.queuePage, [
      {
        uuid,
        queueIndex: settings.queueIndex,
        props: {
          [effect.type]: {
            timing: value,
          },
        },
      },
    ]);
  };

  return (
    <div key={uuid}>
      <p className="text-sm">timing function</p>
      <QueueSelect.Root
        defaultValue={firstObjectCurrentEffect.timing}
        onValueChange={handleTimingFunctionChange}
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
