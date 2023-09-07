import { EffectControllerIndex } from 'components/effect-controller/EffectControllerIndex';
import {
  BaseQueueEffect,
  OBJECT_EFFECT_TRANSLATION_KEY,
  OBJECT_EFFECT_TYPE,
  OBJECT_EFFECT_TYPES,
  QueueEffectType,
} from 'model/effect';
import { ReactElement, useState } from 'react';
import { OBJECT_ADDABLE_EFFECTS, QueueObjectType } from 'model/object';
import { QueueButton, QueueIconButton } from 'components/buttons/button/Button';
import { EffectControllerDuration } from 'components/effect-controller/EffectControllerDuration';
import { EffectControllerTimingFunction } from 'components/effect-controller/EffectControllerTimingFunction';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SettingSelectors } from 'store/settings/selectors';
import { EffectSelectors } from 'store/effect/selectors';
import { nanoid } from '@reduxjs/toolkit';
import { EffectActions, getEffectEntityKey } from '../../store/effect';
import { HistoryActions } from 'store/history';
import { useTranslation } from 'react-i18next';
import { QUEUE_UI_SIZE } from 'styles/ui/Size';
import { SvgRemixIcon } from 'cdk/icon/SvgRemixIcon';
import { QueueDropdown } from 'components/dropdown';
import { QueueScrollArea } from 'components/scroll-area/ScrollArea';
import { QueueSeparator } from 'components/separator/Separator';
import { store } from 'store';

type EffectControllerProps = {
  effectType: QueueEffectType['type'];
};

const AllEffectList = () => {
  const { t } = useTranslation();
  const [firstObject] = useAppSelector(SettingSelectors.selectedObjects);
  const effects = useAppSelector((state) =>
    EffectSelectors.byObjectId(state, firstObject.id),
  );

  return (
    <QueueScrollArea.Root>
      <QueueScrollArea.Viewport className="tw-max-h-25">
        <ul className="tw-text-sm">
          {effects.map((effect, index) => (
            <li key={`effect-${index}-${effect?.id}`}>
              <span className="tw-font-normal tw-text-[var(--gray-11)]">
                #{effect.index + 1}{' '}
              </span>
              <span className="tw-font-normal">
                {t(OBJECT_EFFECT_TRANSLATION_KEY[effect.type])}
              </span>
            </li>
          ))}
        </ul>
      </QueueScrollArea.Viewport>
      <QueueScrollArea.Scrollbar>
        <QueueScrollArea.Thumb />
      </QueueScrollArea.Scrollbar>
    </QueueScrollArea.Root>
  );
};

export const EffectController = ({
  effectType,
}: EffectControllerProps): ReactElement => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  const existingEffectIdsOfSelectedObjects = selectedObjects.map((object) =>
    getEffectEntityKey({
      objectId: object.id,
      type: effectType,
      index: currentQueueIndex,
    }),
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
          disabled={effectType === OBJECT_EFFECT_TYPE.CREATE}>
          <span>{t(OBJECT_EFFECT_TRANSLATION_KEY[effectType])}</span>
        </QueueButton>
        {effectType !== OBJECT_EFFECT_TYPE.CREATE && (
          <QueueIconButton
            className="tw-absolute tw-right-0"
            onClick={handleDeleteEffectButton}
            size={QUEUE_UI_SIZE.SMALL}>
            <SvgRemixIcon
              icon="ri-delete-bin-5-line"
              size={QUEUE_UI_SIZE.SMALL}
            />
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
  queueObject: QueueObjectType,
  effects: QueueEffectType[],
): QueueEffectType => {
  const baseQueueEffect: BaseQueueEffect<void> = {
    id: nanoid(),
    type: 'fade',
    duration: 1000,
    delay: 0,
    index: queueIndex,
    pageId: queueObject.pageId,
    objectId: queueObject.id,
    timing: 'linear',
    prop: undefined,
  };

  switch (effectType) {
    case OBJECT_EFFECT_TYPE.FADE: {
      const initialFade = effects.find(
        (effect) =>
          effect.index === queueIndex - 1 &&
          effect.type === OBJECT_EFFECT_TYPE.FADE,
      );

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_TYPE.FADE,
        prop:
          initialFade?.type === OBJECT_EFFECT_TYPE.FADE
            ? initialFade.prop
            : queueObject.fade,
      };
    }
    case OBJECT_EFFECT_TYPE.FILL: {
      const initialFill = effects.find(
        (effect) =>
          effect.index === queueIndex - 1 &&
          effect.type === OBJECT_EFFECT_TYPE.FILL,
      );

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_TYPE.FILL,
        prop:
          initialFill?.type === OBJECT_EFFECT_TYPE.FILL
            ? initialFill.prop
            : (queueObject as any).fill,
      };
    }
    case OBJECT_EFFECT_TYPE.RECT: {
      const initialRect = effects.reduce(
        (rect, effect) => {
          if (effect.index > queueIndex) {
            return rect;
          }

          if (effect.type === OBJECT_EFFECT_TYPE.RECT) {
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
        type: OBJECT_EFFECT_TYPE.RECT,
        prop: initialRect,
      };
    }
    case OBJECT_EFFECT_TYPE.ROTATE: {
      const initialDegree = effects.reduce((degree, effect) => {
        if (effect.index > queueIndex) {
          return degree;
        }

        if (effect.type === OBJECT_EFFECT_TYPE.ROTATE) {
          return degree + effect.prop.degree;
        }

        return degree;
      }, 0);

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_TYPE.ROTATE,
        prop: {
          degree: initialDegree,
        },
      };
    }
    case OBJECT_EFFECT_TYPE.SCALE: {
      const initialScale = effects.reduce((scale, effect) => {
        if (effect.index > queueIndex) {
          return scale;
        }

        if (effect.type === OBJECT_EFFECT_TYPE.SCALE) {
          return scale + effect.prop.scale;
        }

        return scale;
      }, 1);

      return {
        ...baseQueueEffect,
        type: OBJECT_EFFECT_TYPE.SCALE,
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
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const currentPageId = useAppSelector(SettingSelectors.pageId);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  const hasSelectedObjects = useAppSelector(SettingSelectors.hasSelectedObject);
  const [firstObject] = selectedObjects;

  const effects = useAppSelector((state) =>
    EffectSelectors.byObjectId(state, firstObject.id),
  );

  const objectCurrentEffects = effects.filter(
    (effect) => effect.index === currentQueueIndex,
  );
  const addableEffectTypes = Object.values(
    OBJECT_ADDABLE_EFFECTS[firstObject.type],
  ).filter((effect) => effect !== OBJECT_EFFECT_TYPE.STROKE);
  const currentQueueObjectEffectTypes = objectCurrentEffects.map(
    (currentQueueObjectEffect) => currentQueueObjectEffect.type,
  );
  const createEffectIndex = effects.find(
    (effect) => effect.type === OBJECT_EFFECT_TYPE.CREATE,
  ).index;

  const handleAddEffectItemClick = (
    effectType: QueueEffectType['type'],
  ): void => {
    const selectedObjects = SettingSelectors.selectedObjects(store.getState());
    const models = selectedObjects.map((object) => {
      const newEffects = [...effects];
      return createEffect(
        effectType,
        currentQueueIndex,
        {
          ...object,
          pageId: currentPageId,
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
    <div className="tw-flex tw-flex-wrap tw-gap-2 tw-py-4 tw-px-5">
      <div className="tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
          {t('effect-panel.all-effects')}
        </h2>
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <AllEffectList />
      </div>

      <QueueSeparator.Root className="tw-my-4" />

      <div className="tw-flex tw-items-center tw-justify-between tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
          {t('effect-panel.current-effects')}
        </h2>
        <QueueDropdown>
          <QueueDropdown.Trigger asChild>
            <button
              className="tw-flex tw-items-center disabled:tw-cursor-not-allowed"
              disabled={createEffectIndex === currentQueueIndex}>
              <SvgRemixIcon icon="ri-add-line" size={QUEUE_UI_SIZE.MEDIUM} />
            </button>
          </QueueDropdown.Trigger>
          <QueueDropdown.Content side="right" className="tw-w-[100px]">
            {addableEffectTypes.map((effectType) => {
              if (currentQueueObjectEffectTypes.includes(effectType)) {
                return null;
              }

              return (
                <QueueDropdown.Item
                  key={effectType}
                  onClick={(): void => handleAddEffectItemClick(effectType)}>
                  {t(OBJECT_EFFECT_TRANSLATION_KEY[effectType])}
                </QueueDropdown.Item>
              );
            })}
          </QueueDropdown.Content>
        </QueueDropdown>
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <div className="tw-flex tw-flex-col tw-gap-1">
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
