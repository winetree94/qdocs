import { PlusIcon } from '@radix-ui/react-icons';
import { EffectControllerIndex } from 'components/effect-controller/EffectControllerIndex';
import {
  BaseQueueEffect,
  OBJECT_EFFECT_META,
  QueueEffectType,
} from 'model/effect';
import { ReactElement, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { documentState } from 'store/document';
import { Dropdown } from 'components/dropdown';
import { OBJECT_ADDABLE_EFFECTS, QueueObjectType } from 'model/object';
import { queueObjects } from 'store/object';
import { QueueButton } from 'components/button/Button';
import { EffectControllerDuration } from 'components/effect-controller/EffectControllerDuration';
import { EffectControllerTimingFunction } from 'components/effect-controller/EffectControllerTimingFunction';
import { documentSettingsState } from 'store/settings';

type EffectControllerProps = {
  effectType: QueueEffectType['type'];
};

export const EffectController = ({
  effectType,
}: EffectControllerProps): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <QueueButton
        type="button"
        size="small"
        onClick={(): void => setOpen((prev) => !prev)}
        disabled={effectType === OBJECT_EFFECT_META.CREATE}>
        <span>{effectType}</span>
      </QueueButton>
      {open && (
        <div className="flex flex-col gap-2 p-1 bg-gray-100">
          <EffectControllerDuration effectType={effectType} />
          <EffectControllerTimingFunction effectType={effectType} />
          <EffectControllerIndex effectType={effectType} />
        </div>
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
        },
      };
    }
  }
};

export const EffectControllerBox = (): ReactElement | null => {
  const settings = useRecoilValue(documentSettingsState);
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);

  const selectedObjects = useRecoilValue(
    queueObjects({
      pageIndex: settings.queuePage,
      queueIndex: settings.queueIndex,
    })
  ).filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));
  const hasSelectedObjects = selectedObjects.length > 0;

  const [firstObject] = selectedObjects;
  const objectCurrentEffects = firstObject.effects.filter(
    (effect) => effect.index === settings.queueIndex
  );
  const addableEffectTypes = Object.values(
    OBJECT_ADDABLE_EFFECTS[firstObject.type]
  );
  const currentQueueObjectEffectTypes = objectCurrentEffects.map(
    (currentQueueObjectEffect) => currentQueueObjectEffect.type
  );
  const createEffectIndex = firstObject.effects.find(
    (effect) => effect.type === OBJECT_EFFECT_META.CREATE
  ).index;

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
    <div className="flex flex-col gap-2 p-2">
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
              disabled={createEffectIndex === settings.queueIndex}>
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
                    onClick={(): void => handleAddEffectItemClick(effectType)}>
                    {effectType}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Content>
          </Dropdown>
        </div>
        <div className="flex flex-col gap-1">
          {objectCurrentEffects.map((currentQueueObjectEffect) => (
            <EffectController
              key={`ec-${currentQueueObjectEffect.type}`}
              effectType={currentQueueObjectEffect.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
