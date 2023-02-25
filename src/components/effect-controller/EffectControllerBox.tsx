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
import { DocumentSelectors } from 'store/document/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { EffectSelectors } from 'store/effect/selectors';
import { effectSlice, NormalizedQueueEffect } from 'store/effect/reducer';
import { NormalizedQueueObjectType } from 'store/object/reducer';

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
    type: 'fade',
    duration: 1000,
    index: queueIndex,
    objectId: queueObject.uuid,
    timing: 'linear',
    prop: undefined,
  };

  switch (effectType) {
    case 'fade': {
      const initialFade = effects.find((effect) => effect.index === queueIndex - 1 && effect.type === 'fade');

      return {
        ...baseQueueEffect,
        type: 'fade',
        prop: initialFade?.type === 'fade' ? initialFade.prop : queueObject.fade,
      };
    }
    case 'rect': {
      const initialRect = effects.reduce(
        (rect, effect) => {
          if (effect.index > queueIndex) {
            return rect;
          }

          if (effect.type === 'rect') {
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
        type: 'rect',
        prop: initialRect,
      };
    }
    case 'rotate': {
      const initialDegree = effects.reduce((degree, effect) => {
        if (effect.index > queueIndex) {
          return degree;
        }

        if (effect.type === 'rotate') {
          return degree + effect.prop.degree;
        }

        return degree;
      }, 0);

      return {
        ...baseQueueEffect,
        type: 'rotate',
        prop: {
          degree: initialDegree,
        },
      };
    }
  }
};

export const EffectControllerBox = (): ReactElement | null => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const queueDocument = useAppSelector(DocumentSelectors.serialized);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const hasSelectedObjects = selectedObjects.length > 0;
  const [firstObject] = selectedObjects;

  const effects = useAppSelector((state) => EffectSelectors.byObjectId(state, firstObject.uuid));

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
          pageId: queueDocument!.pages[settings.queuePage].uuid,
        },
        newEffects,
      );
    });

    dispatch(effectSlice.actions.upsertEffects(models));
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
