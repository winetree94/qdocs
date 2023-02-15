import { FadeEffect, FillEffect, MoveEffect, RotateEffect, ScaleEffect, StrokeEffect, TextEffect } from 'model/effect';
import { OBJECT_PROPERTY_META } from 'model/property';
import { selectorFamily } from 'recoil';
import { documentPageObjects } from 'store/page';

export interface Effects {
  [OBJECT_PROPERTY_META.FADE]: FadeEffect;
  [OBJECT_PROPERTY_META.FILL]: FillEffect;
  [OBJECT_PROPERTY_META.RECT]: MoveEffect;
  [OBJECT_PROPERTY_META.ROTATE]: RotateEffect;
  [OBJECT_PROPERTY_META.SCALE]: ScaleEffect;
  [OBJECT_PROPERTY_META.STROKE]: StrokeEffect;
  [OBJECT_PROPERTY_META.TEXT]: TextEffect;
}

/**
 * uuid 를 키로 객체별 RectEffect 를 관리하는 selector
 */
export const objectCurrentEffects = selectorFamily<
  {
    [key: string]: MoveEffect;
  },
  {
    pageIndex: number;
    queueIndex: number;
    uuid: string[];
  }
>({
  key: 'objectCurrentEffect',
  get: (field) => ({ get }): { [key: string]: MoveEffect } => {
    const objects = get(documentPageObjects(field.pageIndex));
    return objects.reduce<{ [key: string]: MoveEffect }>((result, object) => {
      const createEffect = object.effects.find(effect => effect.type === 'create');
      object.effects
        .filter(effect => effect.index <= field.queueIndex)
        .reduce<Effects>((result, effect) => {

          if (effect.type === 'fade') {
            result[OBJECT_PROPERTY_META.FADE] = effect;
          }
          if (effect.type === 'fill') {
            result[OBJECT_PROPERTY_META.FILL] = effect;
          }
          if (effect.type === 'rect') {
            result[OBJECT_PROPERTY_META.RECT] = effect;
          }
          if (effect.type === 'rotate') {
            result[OBJECT_PROPERTY_META.ROTATE] = effect;
          }
          if (effect.type === 'scale') {
            result[OBJECT_PROPERTY_META.SCALE] = effect;
          }
          if (effect.type === 'stroke') {
            result[OBJECT_PROPERTY_META.STROKE] = effect;
          }
          if (effect.type === 'text') {
            result[OBJECT_PROPERTY_META.TEXT] = effect;
          }
          return result;
        }, {
          [OBJECT_PROPERTY_META.FADE]: {
            type: 'fade',
            index: createEffect.index,
            duration: 0,
            timing: 'linear',
            fade: object.fade,
          },
          [OBJECT_PROPERTY_META.FILL]: {
            type: 'fill',
            index: createEffect.index,
            duration: 0,
            timing: 'linear',
            fill: object.fill,
          },
          [OBJECT_PROPERTY_META.RECT]: {
            type: 'rect',
            index: createEffect.index,
            duration: 0,
            timing: 'linear',
            rect: object.rect,
          },
          [OBJECT_PROPERTY_META.ROTATE]: {
            type: 'rotate',
            index: createEffect.index,
            duration: 0,
            timing: 'linear',
            rotate: object.rotate,
          },
          [OBJECT_PROPERTY_META.SCALE]: {
            type: 'scale',
            index: createEffect.index,
            duration: 0,
            timing: 'linear',
            scale: object.scale,
          },
          [OBJECT_PROPERTY_META.STROKE]: {
            type: 'stroke',
            index: createEffect.index,
            duration: 0,
            timing: 'linear',
            stroke: object.stroke,
          },
          [OBJECT_PROPERTY_META.TEXT]: {
            type: 'text',
            index: createEffect.index,
            duration: 0,
            timing: 'linear',
            text: object.text,
          },
        });
      return result;
    }, {});
  },
});

/**
 * uuid 를 키로 객체별 Rect 를 관리하는 selector
 */
// export const objectCurrentRects = selectorFamily<
//   {
//     [key: string]: QueueRect;
//   },
//   {
//     pageIndex: number;
//     queueIndex: number;
//     uuid: string[];
//   }
// >({
//   key: 'objectCurrentRects',
//   get: (field) => ({ get }): { [key: string]: QueueRect } => {
//     const rectEffects = get(objectCurrentEffects({
//       pageIndex: field.pageIndex,
//       queueIndex: field.queueIndex,
//       uuid: field.uuid,
//     }));
//     return Object.entries(rectEffects).reduce<{ [key: string]: QueueRect }>((result, current) => {
//       const [uuid, effect] = current;
//       result[uuid] = effect.rect;
//       return result;
//     }, {});
//   },
//   set: (field) => ({ get, set }, newValue): void => {
//     if (newValue instanceof DefaultValue) {
//       return;
//     }
//     const selector = objectCurrentEffects({
//       pageIndex: field.pageIndex,
//       queueIndex: field.queueIndex,
//       uuid: field.uuid,
//     });
//     const rectEffects = get(selector);
//     const newRectEffects = Object.entries(newValue).reduce<{ [key: string]: MoveEffect }>((result, current) => {
//       const [uuid, rect] = current;
//       result[uuid] = {
//         ...rectEffects[uuid],
//         rect,
//       };
//       return result;
//     }, {});
//     set(selector, newRectEffects);
//   },
// });