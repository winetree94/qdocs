import { EffectControllerIndex } from '@legacy/components/effect-controller/EffectControllerIndex';
import {
  BaseQueueEffect,
  OBJECT_EFFECT_TRANSLATION_KEY,
  OBJECT_EFFECT_TYPE,
  QueueEffectType,
} from '@legacy/model/effect';
import { ReactElement, useState, useMemo } from 'react';
import { QueueObjectType } from '@legacy/model/object';
import { EffectControllerDuration } from '@legacy/components/effect-controller/EffectControllerDuration';
import { EffectControllerTimingFunction } from '@legacy/components/effect-controller/EffectControllerTimingFunction';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { nanoid } from '@reduxjs/toolkit';
import { EffectActions, getEffectEntityKey } from '../../store/effect';
import { HistoryActions } from '@legacy/store/history';
import { useTranslation } from 'react-i18next';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { store } from '@legacy/store';
import { isEqual } from 'lodash';
import { OBJECT_SUPPORTED_EFFECTS } from '@legacy/model/support';
import { RiAddLine, RiDeleteBin5Line } from '@remixicon/react';
import { Button, DropdownMenu, IconButton, ScrollArea, Separator } from '@radix-ui/themes';

type EffectControllerProps = {
  effectType: QueueEffectType['type'];
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
        <Button
          size="1"
          className="tw-flex-1"
          type="button"
          onClick={(): void => setOpen((prev) => !prev)}
          disabled={effectType === OBJECT_EFFECT_TYPE.CREATE}>
          <span>{t(OBJECT_EFFECT_TRANSLATION_KEY[effectType])}</span>
        </Button>
        {effectType !== OBJECT_EFFECT_TYPE.CREATE && (
          <IconButton
            className="tw-absolute tw-right-0"
            onClick={handleDeleteEffectButton}
            >
            <RiDeleteBin5Line size={16} />
          </IconButton>
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
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const currentPageId = useAppSelector(SettingSelectors.pageId);

  const firstSelectedObject = useAppSelector(
    SettingSelectors.firstSelectedObject,
    isEqual,
  );

  const effects = useAppSelector(
    SettingSelectors.firstSelectedObjectEffects,
    isEqual,
  );

  const currentQueueIndexEffects = effects.filter(
    (effect) => effect.index === currentQueueIndex,
  );

  const addableEffectTypes = useMemo(
    () =>
      Object.values(OBJECT_SUPPORTED_EFFECTS[firstSelectedObject.type])
        .filter((effectType) => effectType !== OBJECT_EFFECT_TYPE.CREATE)
        .filter((effectType) => {
          return !currentQueueIndexEffects.find(
            (currentQueueObjectEffect) =>
              currentQueueObjectEffect.type === effectType,
          );
        }),
    [firstSelectedObject.type, currentQueueIndexEffects],
  );

  const isCreateEffectIndex =
    effects.find((effect) => effect.type === OBJECT_EFFECT_TYPE.CREATE)
      .index === currentQueueIndex;

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

  if (!firstSelectedObject) {
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
        <ScrollArea>
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
        </ScrollArea>
      </div>

      <Separator size="4" className="tw-my-4" />

      <div className="tw-flex tw-items-center tw-justify-between tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
          {t('effect-panel.current-effects')}
        </h2>
        {!isCreateEffectIndex && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger disabled={isCreateEffectIndex}>
              <IconButton
                disabled={isCreateEffectIndex}>
                <RiAddLine size={16} />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="right" size={"1"}>
              {addableEffectTypes.map((effectType) => (
                <DropdownMenu.Item
                  key={effectType}
                  onClick={(): void => handleAddEffectItemClick(effectType)}>
                  {t(OBJECT_EFFECT_TRANSLATION_KEY[effectType])}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <div className="tw-flex tw-flex-col tw-gap-1">
          {currentQueueIndexEffects.map((currentQueueObjectEffect) => (
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
