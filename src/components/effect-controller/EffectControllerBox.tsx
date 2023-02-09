import { PlusIcon } from '@radix-ui/react-icons';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { debounce } from 'cdk/functions/debounce';
import { EffectControllerIndex } from 'components/effect-controller/EffectControllerIndex';
import {
  BaseQueueEffect,
  OBJECT_EFFECT_META,
  QueueEffectType,
} from 'model/effect';
import { FormEvent, ReactElement, useCallback, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentState } from 'store/document';
import { documentSettingsState } from 'store/settings';
import { Dropdown } from 'components/dropdown';
import { OBJECT_ADDABLE_EFFECTS, QueueObjectType } from 'model/object';
import { EffectControllerDuration } from 'components/effect-controller/EffectControllerDuration';
import { EffectControllerTimingFunction } from 'components/effect-controller/EffectControllerTimingFunction';

// TODO 중복되는 타입 분리
type ChangedValue = { [k: string]: FormDataEntryValue };
type EffectControllerProps = {
  uuid: string;
  effect: QueueEffectType;
  onEffectChange?: (value: ChangedValue) => void;
};

export const EffectController = ({
  uuid,
  effect,
  onEffectChange,
}: EffectControllerProps): ReactElement => {
  const [open, setOpen] = useState(false);

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
          <EffectControllerDuration effect={effect} uuid={uuid} />
          <EffectControllerTimingFunction effect={effect} uuid={uuid} />
          <EffectControllerIndex effect={effect} />
        </form>
      )}
    </div>
  );
};

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
    case 'rect': {
      const initialRect = queueObject.effects.reduce(
        (rect, effect) => {
          if (effect.index > queueIndex) {
            return rect;
          }

          if (effect.type === 'rect') {
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
        type: 'rect',
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
  const addableEffectTypes = Object.values(
    OBJECT_ADDABLE_EFFECTS[firstObject.type]
  );
  const currentQueueObjectEffectTypes = currentQueueObjectEffects.map(
    (currentQueueObjectEffect) => currentQueueObjectEffect.type
  );
  const createEffectIndex = firstObject.effects.find(
    (effect) => effect.type === OBJECT_EFFECT_META.CREATE
  ).index;

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
                  case 'rect':
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
            <Dropdown.Trigger
              className="flex items-center disabled:cursor-not-allowed"
              disabled={createEffectIndex === settings.queueIndex}
            >
              <PlusIcon />
            </Dropdown.Trigger>
            <Dropdown.Content side="right">
              {addableEffectTypes.map((effectType) => {
                if (currentQueueObjectEffectTypes.includes(effectType)) {
                  return null;
                }

                return (
                  <Dropdown.Item
                    key={effectType}
                    onClick={(): void => handleAddEffectItemClick(effectType)}
                  >
                    {effectType}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Content>
          </Dropdown>
        </div>
        <div className="flex flex-col gap-1">
          {currentQueueObjectEffects.map((currentQueueObjectEffect) => (
            <EffectController
              uuid={firstObject.uuid}
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
