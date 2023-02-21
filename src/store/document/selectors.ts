/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@reduxjs/toolkit';
import { BaseQueueEffect, CreateEffect, FadeEffect, FillEffect, MoveEffect, OBJECT_EFFECT_META, RemoveEffect, RotateEffect, ScaleEffect, StrokeEffect, TextEffect } from 'model/effect';
import { OBJECT_PROPERTY_META } from 'model/meta';
import { QueueObjectType } from 'model/object';
import { QueueFade, QueueFill, QueueRect, QueueRotate, QueueScale, QueueStroke, QueueText } from 'model/property';
import { RootState } from 'store';

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

export interface ObjectQueueProps {
  [OBJECT_PROPERTY_META.FADE]: QueueFade;
  [OBJECT_PROPERTY_META.FILL]: QueueFill;
  [OBJECT_PROPERTY_META.RECT]: QueueRect;
  [OBJECT_PROPERTY_META.ROTATE]: QueueRotate;
  [OBJECT_PROPERTY_META.SCALE]: QueueScale;
  [OBJECT_PROPERTY_META.STROKE]: QueueStroke;
  [OBJECT_PROPERTY_META.TEXT]: QueueText;
}

const selectSelf = (state: RootState): RootState => state;

export const selectDocument = createSelector(selectSelf, (state) => state.document);

export const selectPages = createSelector(selectDocument, (document) => document?.pages ?? []);

export const selectPage = (page: number) => createSelector(selectPages, (pages) => pages[page]);

export const selectPageObjects = (page: number) => createSelector(selectPage(page), (page) => page?.objects ?? []);

export const selectQueueObjects = (page: number, queueIndex: number) => createSelector(selectPageObjects(page), (objects) => {
  return objects.filter((object) => {
    const createEffect = object.effects.find(
      (effect) => effect.type === 'create'
    )!;
    const removeEffect = object.effects.find(
      (effect) => effect.type === 'remove'
    );
    if (queueIndex < createEffect.index) {
      return false;
    }
    if (removeEffect && queueIndex > removeEffect.index) {
      return false;
    }
    return true;
  });
});

export const selectPageObjectsByUUID = (page: number) => createSelector(selectPageObjects(page), (objects) => {
  const result: { [key: string]: QueueObjectType } = {};
  objects.forEach((object) => {
    result[object.uuid] = object;
  });
  return result;
});

export const selectPageObjectByUUID = (page: number, uuid: string) => createSelector(selectPageObjectsByUUID(page), (objects) => objects[uuid]);

export const selectObjectEffectsByQueue = createSelector(selectPages, (pages) => {
  return pages.reduce<{ [key: string]: ObjectQueueEffects; }[][]>((result, current) => {
    const queues: { [key: string]: ObjectQueueEffects; }[] = [];

    current.objects.forEach((object) => {
      const { uuid } = object;
      object.effects
        .forEach((effect) => {
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

export const selectObjectQueueEffects = (page: number, queueIndex: number) => createSelector(selectObjectEffectsByQueue, (objectEffects) => objectEffects[page]?.[queueIndex] || {});

export const selectObjectQueueProps = (page: number, queueIndex: number) => createSelector(selectPage(page), (page) => {
  return page.objects.reduce<{ [key: string]: ObjectQueueProps }>((final, object) => {
    const props = object.effects
      .filter((effect) => effect.index <= queueIndex)
      .reduce((result, effect) => {
        if (effect.type === 'fade') {
          result[OBJECT_PROPERTY_META.FADE] = effect.fade;
        }
        if (effect.type === 'fill') {
          result[OBJECT_PROPERTY_META.FILL] = effect.fill;
        }
        if (effect.type === 'rect') {
          result[OBJECT_PROPERTY_META.RECT] = effect.rect;
        }
        if (effect.type === 'rotate') {
          result[OBJECT_PROPERTY_META.ROTATE] = effect.rotate;
        }
        if (effect.type === 'scale') {
          result[OBJECT_PROPERTY_META.SCALE] = effect.scale;
        }
        if (effect.type === 'stroke') {
          result[OBJECT_PROPERTY_META.STROKE] = effect.stroke;
        }
        if (effect.type === 'text') {
          result[OBJECT_PROPERTY_META.TEXT] = effect.text;
        }
        return result;
      }, {
        [OBJECT_PROPERTY_META.FADE]: object.fade,
        [OBJECT_PROPERTY_META.FILL]: object.fill,
        [OBJECT_PROPERTY_META.RECT]: object.rect,
        [OBJECT_PROPERTY_META.ROTATE]: object.rotate,
        [OBJECT_PROPERTY_META.SCALE]: object.scale,
        [OBJECT_PROPERTY_META.STROKE]: object.stroke,
        [OBJECT_PROPERTY_META.TEXT]: object.text,
      });
    final[object.uuid] = props;
    return final;
  }, {});
});

export const selectObjectDefaultProps = (page: number) => createSelector(selectPage(page), (page) => {
  return page.objects.reduce<{ [key: string]: ObjectQueueProps }>((final, object) => {
    const props = {
      [OBJECT_PROPERTY_META.FADE]: object.fade,
      [OBJECT_PROPERTY_META.FILL]: object.fill,
      [OBJECT_PROPERTY_META.RECT]: object.rect,
      [OBJECT_PROPERTY_META.ROTATE]: object.rotate,
      [OBJECT_PROPERTY_META.SCALE]: object.scale,
      [OBJECT_PROPERTY_META.STROKE]: object.stroke,
      [OBJECT_PROPERTY_META.TEXT]: object.text,
    };
    final[object.uuid] = props;
    return final;
  }, {});
});

export const selectObjectCurrentBasesEffect = (page: number, queueIndex: number, uuids: string[]) => createSelector(selectPageObjects(page), (objects) => {
  return objects.reduce<{ [key: string]: BaseQueueEffect }>(
    (result, object) => {
      result[object.uuid] = object.effects
        .filter((effect) => effect.index <= queueIndex)
        .reduce<BaseQueueEffect>((_, effect) => effect, {
          index: 0,
          duration: 0,
          timing: 'linear',
        });
      return result;
    },
    {}
  );
});