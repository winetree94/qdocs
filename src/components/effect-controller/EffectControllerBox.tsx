import { EffectControllerIndex } from 'components/effect-controller/EffectControllerIndex';
import { BaseQueueEffect, OBJECT_EFFECT_META, QueueEffectType } from 'model/effect';
import { ReactElement, useState } from 'react';
import { OBJECT_ADDABLE_EFFECTS } from 'model/object';
import { QueueButton, QueueIconButton } from 'components/buttons/button/Button';
import { EffectControllerDuration } from 'components/effect-controller/EffectControllerDuration';
import { EffectControllerTimingFunction } from 'components/effect-controller/EffectControllerTimingFunction';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { EffectSelectors } from 'store/effect/selectors';
import { nanoid } from '@reduxjs/toolkit';
import { NormalizedQueueObjectType } from '../../store/object/model';
import { EffectActions, getEffectEntityKey, NormalizedQueueEffect } from '../../store/effect';
import { HistoryActions } from 'store/history';
import { useTranslation } from 'react-i18next';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueDropdown } from 'components/dropdown';

type EffectControllerProps = {
  effectType: QueueEffectType['type'];
};

export const EffectController = ({ effectType }: EffectControllerProps): ReactElement => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  const existingEffectIdsOfSelectedObjects = selectedObjects.map((object) =>
    getEffectEntityKey({ objectId: object.id, type: effectType, index: settings.queueIndex }),
  );

  const handleDeleteEffectButton = () => {
    dispatch(HistoryActions.Capture());
    dispatch(EffectActions.removeMany(existingEffectIdsOfSelectedObjects));
  };

  return (
    <div className="tw-flex tw-flex-col">
      <div className="tw-flex tw-relative">
        <QueueButton
          className="tw-flex-1"
          type="button"
          size={QUEUE_UI_SIZE.SMALL}
          onClick={(): void => setOpen((prev) => !prev)}
          disabled={effectType === OBJECT_EFFECT_META.CREATE}>
          <span>{effectType}</span>
        </QueueButton>
        {effectType !== OBJECT_EFFECT_META.CREATE && (
          <QueueIconButton
            className="tw-absolute tw-right-0"
            onClick={handleDeleteEffectButton}
            size={QUEUE_UI_SIZE.SMALL}>
            <SvgRemixIcon icon="ri-delete-bin-5-line" size={QUEUE_UI_SIZE.SMALL} />
          </QueueIconButton>
        )}
      </div>
      {open && (
        <div className="tw-flex tw-flex-col tw-gap-2 tw-p-1 tw-bg-gray-100">
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
  const { t } = useTranslation();
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

    dispatch(HistoryActions.Capture());
    dispatch(EffectActions.upsertEffects(models));
  };

  if (!hasSelectedObjects) {
    return null;
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-2 tw-p-2">
      <div>
        <p className="tw-font-medium">{t('effect-panel.all-effects')}</p>
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
        <div className="tw-flex tw-justify-between">
          <p className="tw-font-medium">{t('effect-panel.current-effects')}</p>
          <QueueDropdown>
            <QueueDropdown.Trigger asChild>
              <button
                className="tw-flex tw-items-center disabled:tw-cursor-not-allowed"
                disabled={createEffectIndex === settings.queueIndex}>
                <SvgRemixIcon icon="ri-add-line" size={QUEUE_UI_SIZE.SMALL} />
              </button>
            </QueueDropdown.Trigger>
            <QueueDropdown.Content side="right" className="tw-w-[100px]">
              {addableEffectTypes.map((effectType) => {
                if (currentQueueObjectEffectTypes.includes(effectType)) {
                  return null;
                }

                return (
                  <QueueDropdown.Item key={effectType} onClick={(): void => handleAddEffectItemClick(effectType)}>
                    {effectType}
                  </QueueDropdown.Item>
                );
              })}
            </QueueDropdown.Content>
          </QueueDropdown>
        </div>
        <div className="tw-flex tw-flex-col tw-gap-1">
          {objectCurrentEffects.map((currentQueueObjectEffect) => (
            <EffectController key={`ec-${currentQueueObjectEffect.type}`} effectType={currentQueueObjectEffect.type} />
          ))}
        </div>
      </div>
    </div>
  );
};
