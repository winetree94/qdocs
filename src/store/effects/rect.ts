import { cloneDeep } from 'lodash';
import { MoveEffect } from 'model/effect';
import { QueueRect } from 'model/property';
import { DefaultValue, selectorFamily } from 'recoil';
import { documentPageObjects } from 'store/page';

/**
 * uuid 를 키로 객체별 RectEffect 를 관리하는 selector
 */
export const objectCurrentRectsEffect = selectorFamily<
  {
    [key: string]: MoveEffect;
  },
  {
    pageIndex: number;
    queueIndex: number;
    uuid: string[];
  }
>({
  key: 'objectCurrentRectsEffect',
  get: (field) => ({ get }): { [key: string]: MoveEffect } => {
    const objects = get(documentPageObjects(field.pageIndex));
    return objects.reduce<{ [key: string]: MoveEffect }>((result, object) => {
      result[object.uuid] = object.effects
        .filter(
          (effect): effect is MoveEffect => effect.type === 'rect' && effect.index <= field.queueIndex
        )
        .reduce<MoveEffect>((_, effect) => effect, {
          type: 'rect',
          index: 0,
          duration: 0,
          timing: 'linear',
          rect: object.rect,
        });
      return result;
    }, {});
  },
  set: (field) => ({ get, set }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = documentPageObjects(field.pageIndex);
    const objects = get(selector);

    const newObjects = objects.map((object) => {
      const existObject = object;
      const newObject = cloneDeep(existObject);
      const createEffect = newObject.effects
        .find((effect) => effect.type === 'create');

      if (createEffect.index === field.queueIndex) {
        newObject.rect = newValue[object.uuid].rect;
        return newObject;
      }

      const existEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'rect' && effect.index === field.queueIndex);
      if (existEffectIndex === -1) {
        newObject.effects.push({
          type: 'rect',
          index: field.queueIndex,
          timing: 'linear',
          duration: 1000,
          rect: newValue[object.uuid].rect,
        });
      } else {
        newObject.effects[existEffectIndex] = newValue[object.uuid];
      }

      newObject.effects.sort((a, b) => a.index - b.index);
      return newObject;
    });

    set(selector, newObjects);
  }
});

/**
 * uuid 를 키로 객체별 Rect 를 관리하는 selector
 */
export const objectCurrentRects = selectorFamily<
  {
    [key: string]: QueueRect;
  },
  {
    pageIndex: number;
    queueIndex: number;
    uuid: string[];
  }
>({
  key: 'objectCurrentRects',
  get: (field) => ({ get }): { [key: string]: QueueRect } => {
    const rectEffects = get(objectCurrentRectsEffect({
      pageIndex: field.pageIndex,
      queueIndex: field.queueIndex,
      uuid: field.uuid,
    }));
    return Object.entries(rectEffects).reduce<{ [key: string]: QueueRect }>((result, current) => {
      const [uuid, effect] = current;
      result[uuid] = effect.rect;
      return result;
    }, {});
  },
  set: (field) => ({ get, set }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = objectCurrentRectsEffect({
      pageIndex: field.pageIndex,
      queueIndex: field.queueIndex,
      uuid: field.uuid,
    });
    const rectEffects = get(selector);
    const newRectEffects = Object.entries(newValue).reduce<{ [key: string]: MoveEffect }>((result, current) => {
      const [uuid, rect] = current;
      result[uuid] = {
        ...rectEffects[uuid],
        rect,
      };
      return result;
    }, {});
    set(selector, newRectEffects);
  },
});