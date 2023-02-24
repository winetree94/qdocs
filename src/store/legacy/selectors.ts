/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@reduxjs/toolkit';
import {
  CreateEffect,
  FadeEffect,
  FillEffect,
  MoveEffect,
  OBJECT_EFFECT_META,
  RemoveEffect,
  RotateEffect,
  ScaleEffect,
  StrokeEffect,
  TextEffect,
} from 'model/effect';
import { OBJECT_PROPERTY_META } from 'model/meta';
import { QueueObjectType } from 'model/object';
import { DocumentSelectors } from 'store/document/selectors';

export interface ObjectQueueEffects {
  [OBJECT_EFFECT_META.CREATE]?: Omit<CreateEffect, 'index'>;
  [OBJECT_PROPERTY_META.FADE]?: Omit<FadeEffect, 'index'>;
  [OBJECT_PROPERTY_META.FILL]?: Omit<FillEffect, 'index'>;
  [OBJECT_PROPERTY_META.RECT]?: Omit<MoveEffect, 'index'>;
  [OBJECT_PROPERTY_META.ROTATE]?: Omit<RotateEffect, 'index'>;
  [OBJECT_PROPERTY_META.SCALE]?: Omit<ScaleEffect, 'index'>;
  [OBJECT_PROPERTY_META.STROKE]?: Omit<StrokeEffect, 'index'>;
  [OBJECT_PROPERTY_META.TEXT]?: Omit<TextEffect, 'index'>;
  [OBJECT_EFFECT_META.REMOVE]?: Omit<RemoveEffect, 'index'>;
}

/**
 * @deprecated
 */
const selectPages = createSelector(DocumentSelectors.serialized, (document) => document?.pages ?? []);

/**
 * @deprecated
 */
const selectPage = (page: number) => createSelector(selectPages, (pages) => pages[page]);

/**
 * @deprecated
 */
export const selectPageObjects = (page: number) => createSelector(selectPage(page), (page) => page?.objects ?? []);

/**
 * @deprecated
 */
export const selectQueueObjects = (page: number, queueIndex: number) => {
  return createSelector(selectPageObjects(page), (objects) => {
    return objects.filter((object) => {
      const createEffect = object.effects.find((effect) => effect.type === 'create');
      const removeEffect = object.effects.find((effect) => effect.type === 'remove');
      if (queueIndex < createEffect.index) {
        return false;
      }
      if (removeEffect && queueIndex > removeEffect.index) {
        return false;
      }
      return true;
    });
  });
};

/**
 * @deprecated
 */
export const selectPageObjectsByUUID = (page: number) => {
  return createSelector(selectPageObjects(page), (objects) => {
    const result: { [key: string]: QueueObjectType } = {};
    objects.forEach((object) => {
      result[object.uuid] = object;
    });
    return result;
  });
};

/**
 * @deprecated
 */
export const selectPageObjectByUUID = (page: number, uuid: string) => {
  return createSelector(selectPageObjectsByUUID(page), (objects) => objects[uuid]);
};

/**
 * @deprecated
 */
export const selectObjectEffectsByQueue = createSelector(selectPages, (pages) => {
  return pages.reduce<{ [key: string]: ObjectQueueEffects }[][]>((result, current) => {
    const queues: { [key: string]: ObjectQueueEffects }[] = [];

    current.objects.forEach((object) => {
      const { uuid } = object;
      object.effects.forEach((effect) => {
        if (!queues[effect.index]) {
          queues[effect.index] = {};
        }
        if (!queues[effect.index][uuid]) {
          queues[effect.index][uuid] = {};
        }
        if (effect.type === 'create') {
          queues[effect.index][uuid][OBJECT_EFFECT_META.CREATE] = effect;
        }
        if (effect.type === 'fade') {
          queues[effect.index][uuid][OBJECT_PROPERTY_META.FADE] = effect;
        }
        if (effect.type === 'fill') {
          queues[effect.index][uuid][OBJECT_PROPERTY_META.FILL] = effect;
        }
        if (effect.type === 'rect') {
          queues[effect.index][uuid][OBJECT_PROPERTY_META.RECT] = effect;
        }
        if (effect.type === 'rotate') {
          queues[effect.index][uuid][OBJECT_PROPERTY_META.ROTATE] = effect;
        }
        if (effect.type === 'scale') {
          queues[effect.index][uuid][OBJECT_PROPERTY_META.SCALE] = effect;
        }
        if (effect.type === 'stroke') {
          queues[effect.index][uuid][OBJECT_PROPERTY_META.STROKE] = effect;
        }
        if (effect.type === 'text') {
          queues[effect.index][uuid][OBJECT_PROPERTY_META.TEXT] = effect;
        }
        if (effect.type === 'remove') {
          queues[effect.index][uuid][OBJECT_EFFECT_META.REMOVE] = effect;
        }
      });
    });

    // 빈 큐에 채워넣음
    for (let i = 0; i < queues.length; i++) {
      if (!queues[i]) {
        queues[i] = {};
      }
    }

    result.push(queues);
    return result;
  }, []);
});

/**
 * @deprecated
 */
export const selectObjectQueueEffects = (page: number, queueIndex: number) => {
  return createSelector(selectObjectEffectsByQueue, (objectEffects) => objectEffects[page]?.[queueIndex] || {});
};
