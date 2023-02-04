import { PlusIcon } from '@radix-ui/react-icons';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { debounce } from 'cdk/functions/debounce';
import { EffectControllerIndex } from 'components/effect-controller/EffectControllerIndex';
import { Slider } from 'components/slider';
import { BaseQueueEffect, QueueEffectType } from 'model/effect';
import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentState } from 'store/document';
import { documentSettingsState } from 'store/settings';
import { Dropdown } from 'components/dropdown';
import { QueueObjectType } from 'model/object';

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

  useEffect(() => {
    setDuration([effect.duration / 1000]);
  }, [effect.duration]);

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

const addableEffectTypes: {
  label: string;
  type: QueueEffectType['type'];
}[] = [
  {
    label: 'fade',
    type: 'fade',
  },
  {
    label: 'fill',
    type: 'fill',
  },
  {
    label: 'move',
    type: 'move',
  },
  {
    label: 'rotate',
    type: 'rotate',
  },
  {
    label: 'scale',
    type: 'scale',
  },
  {
    label: 'stroke',
    type: 'stroke',
  },
];

const createEffect = (
  effectType: QueueEffectType['type'],
  queueIndex: QueueEffectType['index'],
  queueObject: QueueObjectType
): QueueEffectType => {
  const baseQueueEffect: BaseQueueEffect = {
    duration: 1000,
    index: queueIndex,
    timing: 'linear',
  };

  switch (effectType) {
    case 'fade': {
      const initialFade = queueObject.effects.find(
        (effect) => effect.index === queueIndex - 1 && effect.type === 'fade'
      );

      return {
        ...baseQueueEffect,
        type: 'fade',
        fade:
          initialFade?.type === 'fade' ? initialFade.fade : queueObject.fade,
      };
    }
    case 'move': {
      const initialRect = queueObject.effects.reduce(
        (rect, effect) => {
          if (effect.index > queueIndex) {
            return rect;
          }

          if (effect.type === 'move') {
            return {
              width: rect.width + effect.rect.width,
              height: rect.height + effect.rect.height,
              x: rect.x + effect.rect.x,
              y: rect.y + effect.rect.y,
            };
          }

          return rect;
        },
        {
          ...queueObject.rect,
        }
      );
      return {
        ...baseQueueEffect,
        type: 'move',
        rect: initialRect,
      };
    }
    case 'rotate': {
      const initialDegree = queueObject.effects.reduce((degree, effect) => {
        if (effect.index > queueIndex) {
          return degree;
        }

        if (effect.type === 'rotate') {
          return degree + effect.rotate.degree;
        }

        return degree;
      }, 0);

      return {
        ...baseQueueEffect,
        type: 'rotate',
        rotate: {
          degree: initialDegree,
          // 없어질 값이라 'forward' 고정
          position: 'forward',
        },
      };
    }
  }
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
  const currentQueueObjectEffectTypes = currentQueueObjectEffects.map(
    (currentQueueObjectEffect) => currentQueueObjectEffect.type
  );

  const debounceEffectChange = useMemo(
    () =>
      debounce((value) => {
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
                duration: parseInt(value.duration as string) || effect.duration,
                timing:
                  (value.timingFunction as AnimatorTimingFunctionType) ||
                  effect.timing,
              };

              const updatedEffect = ((): QueueEffectType => {
                switch (effect.type) {
                  case 'fade':
                    return {
                      ...effect,
                      fade: {
                        opacity: parseFloat(value.fadeOpacity as string),
                      },
                    };
                  case 'move':
                    return {
                      ...effect,
                    };
                  case 'rotate':
                    return {
                      ...effect,
                      rotate: {
                        ...effect.rotate,
                        degree:
                          parseInt(value.rotate as string) ||
                          effect.rotate.degree,
                      },
                    };

                  default:
                    return effect;
                }
              })();

              return {
                ...updatedBaseEffect,
                ...updatedEffect,
              };
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
    [
      queueDocument,
      setQueueDocument,
      settings.queueIndex,
      settings.queuePage,
      settings.selectedObjectUUIDs,
    ]
  );

  const handleEffectChange = useCallback(
    (value: ChangedValue) => debounceEffectChange(value),
    [debounceEffectChange]
  );

  const handleAddEffectItemClick = (
    effectType: QueueEffectType['type']
  ): void => {
    const newObjects = queueDocument!.pages[settings.queuePage].objects.map(
      (object) => {
        if (!settings.selectedObjectUUIDs.includes(object.uuid)) {
          return object;
        }

        const newEffects = [...object.effects];
        const newIndex = newEffects.findIndex(
          (effect) => effect.index === settings.queueIndex
        );
        newEffects.splice(
          newIndex,
          0,
          createEffect(effectType, settings.queueIndex, object)
        );

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
  };

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
          <Dropdown>
            <Dropdown.Trigger className="flex items-center">
              <PlusIcon />
            </Dropdown.Trigger>
            <Dropdown.Content side="right">
              {addableEffectTypes.map((effectType) => {
                if (currentQueueObjectEffectTypes.includes(effectType.type)) {
                  return null;
                }

                return (
                  <Dropdown.Item
                    key={effectType.label}
                    onClick={(): void =>
                      handleAddEffectItemClick(effectType.type)
                    }
                  >
                    {effectType.label}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Content>
          </Dropdown>
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
