import { PlusIcon } from '@radix-ui/react-icons';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { debounce } from 'cdk/functions/debounce';
import { EffectControllerIndex } from 'components/effect-controller/EffectControllerIndex';
import { Slider } from 'components/slider';
import { BaseQueueEffect, QueueEffectType } from 'model/effect';
import { QueueRotate } from 'model/property';
import { FormEvent, ReactElement, useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentState } from 'store/document';
import { documentSettingsState } from 'store/settings';

// TODO 중복되는 타입 분리
type ChangedValue = { [k: string]: FormDataEntryValue };
type EffectControllerProps = {
  effect: QueueEffectType;
  onEffectChange?: (value: ChangedValue) => void;
};

export const EffectController = ({
  effect,
  onEffectChange,
}: EffectControllerProps): ReactElement => {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState([effect.duration / 1000]);

  const handleEffectChange = (event: FormEvent<HTMLFormElement>): void => {
    const formData = new FormData(event.currentTarget);

    onEffectChange?.(Object.fromEntries(formData));
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        className="flex-1 hover:bg-gray-100"
        onClick={(): void => setOpen((prev) => !prev)}
      >
        <span>{effect.type}</span>
      </button>
      {open && (
        <form
          className="flex flex-col gap-2 p-1 bg-gray-100"
          onChange={handleEffectChange}
        >
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
                  onChange={(e): void =>
                    setDuration([parseFloat(e.currentTarget.value)])
                  }
                />
              </div>
              <div className="flex items-center w-full">
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  value={duration}
                  onValueChange={(value): void => setDuration(value)}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm">timing function</p>
            <select name="timingFunction" defaultValue={effect.timing}>
              <option value="linear">linear</option>
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
            </select>
          </div>
          <EffectControllerIndex effect={effect} />
        </form>
      )}
    </div>
  );
};

export const EffectControllerBox = (): ReactElement | null => {
  const settings = useRecoilValue(documentSettingsState);
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const selectedObjects = queueDocument!.pages[
    settings.queuePage
  ].objects.filter((object) =>
    settings.selectedObjectUUIDs.includes(object.uuid)
  );
  const hasSelectedObjects = selectedObjects.length > 0;

  const [firstObject] = selectedObjects;
  const currentQueueObjectEffects = firstObject.effects.filter(
    (effect) => effect.index === settings.queueIndex
  );

  const handleEffectChange = useCallback(
    debounce((value: ChangedValue) => {
      const newObjects = queueDocument!.pages[settings.queuePage].objects.map(
        (object) => {
          if (!settings.selectedObjectUUIDs.includes(object.uuid)) {
            return object;
          }

          const newEffects = object.effects.map((effect) => {
            if (effect.index !== settings.queueIndex) {
              return effect;
            }

            const updatedBaseEffect: BaseQueueEffect = {
              index: effect.index,
              duration: parseFloat(value.duration as string),
              timing: value.timingFunction as AnimatorTimingFunctionType,
            };

            switch (effect.type) {
              case 'rotate':
                return {
                  ...effect,
                  ...updatedBaseEffect,
                  scale: {
                    ...effect.rotate,
                    degree: parseInt(value.rotate as string),
                    position: value.position as QueueRotate['position'],
                  },
                };

              default:
                return effect;
            }
          });

          return {
            ...object,
            effects: newEffects,
          };
        }
      );

      const newPages = queueDocument!.pages.slice(0);
      newPages[settings.queuePage] = {
        ...queueDocument!.pages[settings.queuePage],
        objects: newObjects,
      };

      setQueueDocument({ ...queueDocument!, pages: newPages });
    }, 50),
    []
  );

  if (!hasSelectedObjects) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="font-medium">Object effects</p>
        <ul>
          {firstObject.effects.map((effect, index) => (
            <li key={`effect-${index}`}>
              <span>#{effect.index + 1} </span>
              <span>{effect.type}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex justify-between">
          <p className="font-medium">Queue effects</p>
          <button type="button">
            <PlusIcon />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {currentQueueObjectEffects.map((currentQueueObjectEffect) => (
            <EffectController
              key={currentQueueObjectEffect.type}
              effect={currentQueueObjectEffect}
              onEffectChange={handleEffectChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
