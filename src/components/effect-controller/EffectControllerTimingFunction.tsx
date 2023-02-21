import { ChevronDownIcon } from '@radix-ui/react-icons';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { QueueSelect } from 'components/select/Select';
import { QueueEffectType } from 'model/effect';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setObjectQueueEffects } from 'store/document/actions';
import { ObjectQueueEffects, selectObjectQueueEffects, selectQueueObjects } from 'store/document/selectors';
import { selectSettings } from 'store/settings/selectors';

export type EffectControllerTimingFunctionProps = {
  effectType: QueueEffectType['type'];
};

export const EffectControllerTimingFunction = ({
  effectType,
}: EffectControllerTimingFunctionProps): ReactElement => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const effects = useSelector(selectObjectQueueEffects(settings.queuePage, settings.queueIndex));
  const selectedObjects = useSelector(selectQueueObjects(settings.queuePage, settings.queueIndex)).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));
  const [firstSelectedObject] = selectedObjects;

  const firstObjectEffect = effects[firstSelectedObject.uuid][effectType];

  const handleTimingFunctionChange = (timingFunction: string): void => {
    settings.selectedObjectUUIDs.forEach((objectUUID) => {
      const nextEffect: ObjectQueueEffects[QueueEffectType['type']] = {
        ...effects[objectUUID][effectType],
        timing: timingFunction as AnimatorTimingFunctionType,
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
