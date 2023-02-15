import { cloneDeep } from 'lodash';
import { RotateEffect } from 'model/effect';
import { QueueRotate } from 'model/property';
import { DefaultValue, selectorFamily } from 'recoil';
import { documentPageObjects } from 'store/page';

/**
 * uuid 를 키로 객체별 RotateEffect 를 관리하는 selector
 */
export const objectCurrentRotatesEffect = selectorFamily<
  {
    [key: string]: RotateEffect;
  },
  {
    pageIndex: number;
    queueIndex: number;
    uuid: string[];
  }
>({
  key: 'objectCurrentRotatesEffect',
  get: (field) => ({ get }): { [key: string]: RotateEffect } => {
    const objects = get(documentPageObjects(field.pageIndex));
    return objects.reduce<{ [key: string]: RotateEffect }>((result, object) => {
      result[object.uuid] = object.effects
        .filter(
          (effect): effect is RotateEffect => effect.type === 'rotate' && effect.index <= field.queueIndex
        )
        .reduce<RotateEffect>((_, effect) => effect, {
          type: 'rotate',
          index: 0,
          duration: 0,
          timing: 'linear',
          rotate: object.rotate,
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
        newObject.rotate = newValue[object.uuid].rotate;
        return newObject;
      }

      const existEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'rotate' && effect.index === field.queueIndex);
      if (existEffectIndex === -1) {
        newObject.effects.push({
          type: 'rotate',
          index: field.queueIndex,
          timing: 'linear',
          duration: 1000,
          rotate: newValue[object.uuid].rotate,
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
 * uuid 를 키로 객체별 Rotate 를 관리하는 selector
 */
export const objectCurrentRotates = selectorFamily<
  {
    [key: string]: QueueRotate;
  },
  {
    pageIndex: number;
    queueIndex: number;
    uuid: string[];
  }
>({
  key: 'objectCurrentRotates',
  get: (field) => ({ get }): { [key: string]: QueueRotate } => {
    const rectEffects = get(objectCurrentRotatesEffect({
      pageIndex: field.pageIndex,
      queueIndex: field.queueIndex,
      uuid: field.uuid,
    }));
    return Object.entries(rectEffects).reduce<{ [key: string]: QueueRotate }>((result, current) => {
      const [uuid, effect] = current;
      result[uuid] = effect.rotate;
      return result;
    }, {});
  },
  set: (field) => ({ get, set }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = objectCurrentRotatesEffect({
      pageIndex: field.pageIndex,
      queueIndex: field.queueIndex,
      uuid: field.uuid,
    });
    const rectEffects = get(selector);
    const newRectEffects = Object.entries(newValue).reduce<{ [key: string]: RotateEffect }>((result, current) => {
      const [uuid, rotate] = current;
      result[uuid] = {
        ...rectEffects[uuid],
        rotate,
      };
      return result;
    }, {});
    set(selector, newRectEffects);
  },
});