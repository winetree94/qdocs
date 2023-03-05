import { PlusIcon } from '@radix-ui/react-icons';
import { EffectControllerIndex } from 'components/effect-controller/EffectControllerIndex';
import { BaseQueueEffect, OBJECT_EFFECT_META, QueueEffectType } from 'model/effect';
import { ReactElement, useState } from 'react';
import { Dropdown } from 'components/dropdown';
import { OBJECT_ADDABLE_EFFECTS } from 'model/object';
import { QueueButton } from 'components/button/Button';
import { EffectControllerDuration } from 'components/effect-controller/EffectControllerDuration';
import { EffectControllerTimingFunction } from 'components/effect-controller/EffectControllerTimingFunction';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { EffectSelectors } from 'store/effect/selectors';
import { nanoid } from '@reduxjs/toolkit';
import { NormalizedQueueObjectType } from '../../store/object/model';
import { EffectActions, NormalizedQueueEffect } from '../../store/effect';

type EffectControllerProps = {
  effectType: QueueEffectType['type'];
};

export const EffectController = ({ effectType }: EffectControllerProps): ReactElement => {
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
  queueObject: NormalizedQueueObjectType,
  effects: NormalizedQueueEffect[],
): QueueEffectType => {
  const baseQueueEffect: BaseQueueEffect<void> = {
    id: nanoid(),
    type: 'fade',
    duration: 1000,
    delay: 0,
    index: queueIndex,
    objectId: queueObject.id,
    timing: 'linear',
    prop: undefined,
  };

  switch (effectType) {
    case OBJECT_EFFECT_META.FADE: {
      const initialFade = effects.find(
        (effect) => effect.index === queueIndex - 1 && effect.type === OBJECT_EFFECT_META.FADE,
      );

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_META.FADE,
        prop: initialFade?.type === OBJECT_EFFECT_META.FADE ? initialFade.prop : queueObject.fade,
      };
    }
    case OBJECT_EFFECT_META.FILL: {
      const initialFill = effects.find(
        (effect) => effect.index === queueIndex - 1 && effect.type === OBJECT_EFFECT_META.FILL,
      );

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_META.FILL,
        prop: initialFill?.type === OBJECT_EFFECT_META.FILL ? initialFill.prop : queueObject.fill,
      };
    }
    case OBJECT_EFFECT_META.RECT: {
      const initialRect = effects.reduce(
        (rect, effect) => {
          if (effect.index > queueIndex) {
            return rect;
          }

          if (effect.type === OBJECT_EFFECT_META.RECT) {
            return {
              width: rect.width + effect.prop.width,
              height: rect.height + effect.prop.height,
              x: rect.x + effect.prop.x,
              y: rect.y + effect.prop.y,
            };
          }

          return rect;
        },
        {
          ...queueObject.rect,
        },
      );
      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_META.RECT,
        prop: initialRect,
      };
    }
    case OBJECT_EFFECT_META.ROTATE: {
      const initialDegree = effects.reduce((degree, effect) => {
        if (effect.index > queueIndex) {
          return degree;
        }

        if (effect.type === OBJECT_EFFECT_META.ROTATE) {
          return degree + effect.prop.degree;
        }

        return degree;
      }, 0);

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_META.ROTATE,
        prop: {
          degree: initialDegree,
        },
      };
    }
    case OBJECT_EFFECT_META.SCALE: {
      const initialScale = effects.reduce((scale, effect) => {
        if (effect.index > queueIndex) {
          return scale;
        }

        if (effect.type === OBJECT_EFFECT_META.SCALE) {
          return scale + effect.prop.scale;
        }

        return scale;
      }, 1);

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_META.SCALE,
        prop: {
          scale: initialScale,
        },
      };
    }
  }
};

export const EffectControllerBox = (): ReactElement | null => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const hasSelectedObjects = selectedObjects.length > 0;
  const [firstObject] = selectedObjects;

  const effects = useAppSelector((state) => EffectSelectors.byObjectId(state, firstObject.id));

  const objectCurrentEffects = effects.filter((effect) => effect.index === settings.queueIndex);
  const addableEffectTypes = Object.values(OBJECT_ADDABLE_EFFECTS[firstObject.type]);
  const currentQueueObjectEffectTypes = objectCurrentEffects.map(
    (currentQueueObjectEffect) => currentQueueObjectEffect.type,
  );
  const createEffectIndex = effects.find((effect) => effect.type === OBJECT_EFFECT_META.CREATE).index;

  const handleAddEffectItemClick = (effectType: QueueEffectType['type']): void => {
    const models = selectedObjects.map((object) => {
      const newEffects = [...effects];
      return createEffect(
        effectType,
        settings.queueIndex,
        {
          ...object,
          pageId: settings.pageId,
        },
        newEffects,
      );
    });

    dispatch(EffectActions.upsertEffects(models));
  };

  if (!hasSelectedObjects) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div>
        <p className="font-medium">Object effects</p>
        <ul>
          {effects.map((effect, index) => (
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
                  <Dropdown.Item key={effectType} onClick={(): void => handleAddEffectItemClick(effectType)}>
                    {effectType}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Content>
          </Dropdown>
        </div>
        <div className="flex flex-col gap-1">
          {objectCurrentEffects.map((currentQueueObjectEffect) => (
            <EffectController key={`ec-${currentQueueObjectEffect.type}`} effectType={currentQueueObjectEffect.type} />
          ))}
        </div>
      </div>
    </div>
  );
};
