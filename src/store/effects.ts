import { cloneDeep } from 'lodash';
import { CreateEffect, FadeEffect, FillEffect, MoveEffect, OBJECT_EFFECT_META, RemoveEffect, RotateEffect, ScaleEffect, StrokeEffect, TextEffect } from 'model/effect';
import { OBJECT_PROPERTY_META, QueueFade, QueueFill, QueueRect, QueueRotate, QueueScale, QueueStroke, QueueText } from 'model/property';
import { DefaultValue, selector, selectorFamily } from 'recoil';
import { queueDocumentPageObjects, queueDocumentPages } from 'store/page';

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
 * queue effect index 기반으로 오브젝트 이펙트들을 관리하는 readonly selector
 *
 * const effectsByQueue = useRecoilValue(objectEffectsByQueues);
 * effectsByQueue[pageNumber][queueNumber][uuid][effectType]
 */
export const objectEffectsByQueues = selector<
  { [key: string]: ObjectQueueEffects; }[][]
>({
  key: 'objectEffectsByQueues',
  get: ({ get }): { [key: string]: ObjectQueueEffects; }[][] => {
    const pages = get(queueDocumentPages);

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
  },
});

/**
 * @description
 * 오브젝트 별로 pageIndex, queueIndex 에 해당하는 이펙트들을 관리하는 셀렉터
 * 이 셀렉터를 활용하면 특정 큐에서 이펙트를 읽기 / 생성 / 수정 / 삭제하는 과정을 간소화 할 수 있다.
 *
 * 특정 큐에서 없는 이펙트는 null 로 반환되며, 이펙트가 존재하는 경우 해당 이펙트를 반환한다.
 * 단, 생성된 큐에서 이펙트를 업데이트하는 경우 오브젝트의 기본 속성이 업데이트된다.
 *
 * 해당 큐에 오브젝트가 존재해도 큐의 이펙트가 존재하지 않는 경우 해당 객체는 반환되지 않는다.
 * nullish operator 를 반드시 함께 사용해야 한다.
 * @example
 * const effectsByQueue = useRecoilValue(objectEffectsByQueues);
 * effects[uuid]?.[effectType]?.[property]
 */
export const objectQueueEffects = selectorFamily<
  {
    [key: string]: ObjectQueueEffects;
  },
  {
    pageIndex: number;
    queueIndex: number;
  }
>({
  key: 'objectQueueEffects',
  get: (field) => ({ get }): { [key: string]: ObjectQueueEffects } => {
    return get(objectEffectsByQueues)[field.pageIndex]?.[field.queueIndex] || {};
  },
  set: (field) => ({ get, set }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = queueDocumentPageObjects(field.pageIndex);
    const objects = get(selector);
    const newObjects = objects.map((object) => {
      const newObject = cloneDeep(object);
      const existCreateEffectIndex = newObject.effects.findIndex((effect) => effect.type === 'create');

      /**
       * @description
       * 만약 오브젝트가 생성된 큐에서 이펙트를 변화시키는 경우,
       * 이펙트에 추가하지 않고 오브젝트의 속성을 업데이트 시킨다.
       * 편의성 때문에 여기서 넣었는데 이게 맞는지는 고민이 필요
       */
      if (newObject.effects[existCreateEffectIndex].index === field.queueIndex) {
        newObject.fade = newValue[object.uuid].fade?.fade || newObject.fade;
        newObject.fill = newValue[object.uuid].fill?.fill || newObject.fill;
        newObject.rect = newValue[object.uuid].rect?.rect || newObject.rect;
        newObject.rotate = newValue[object.uuid].rotate?.rotate || newObject.rotate;
        newObject.scale = newValue[object.uuid].scale?.scale || newObject.scale;
        newObject.stroke = newValue[object.uuid].stroke?.stroke || newObject.stroke;
        newObject.text = newValue[object.uuid].text?.text || newObject.text;
        return newObject;
      }

      // fade
      const existFadeEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'fade' && effect.index === field.queueIndex);
      if (newValue[object.uuid]?.fade) {
        if (existFadeEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].fade,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existFadeEffectIndex] = {
            ...newValue[object.uuid].fade,
            index: field.queueIndex,
          };
        }
      } else if (existFadeEffectIndex !== -1) {
        newObject.effects.splice(existFadeEffectIndex, 1);
      }

      // fill
      const existFillEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'fill' && effect.index === field.queueIndex);
      if (newValue[object.uuid]?.fill) {
        if (existFillEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].fill,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existFillEffectIndex] = {
            ...newValue[object.uuid].fill,
            index: field.queueIndex,
          };
        }
      } else if (existFillEffectIndex !== -1) {
        newObject.effects.splice(existFillEffectIndex, 1);
      }

      // rect
      const existRectEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'rect' && effect.index === field.queueIndex);
      if (newValue[object.uuid]?.rect) {
        if (existRectEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].rect,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existRectEffectIndex] = {
            ...newValue[object.uuid].rect,
            index: field.queueIndex,
          };
        }
      } else if (existRectEffectIndex !== -1) {
        newObject.effects.splice(existRectEffectIndex, 1);
      }

      // rotate
      const existRotateEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'rotate' && effect.index === field.queueIndex);
      if (newValue[object.uuid]?.rotate) {
        if (existRotateEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].rotate,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existRotateEffectIndex] = {
            ...newValue[object.uuid].rotate,
            index: field.queueIndex,
          };
        }
      } else if (existRotateEffectIndex !== -1) {
        newObject.effects.splice(existRotateEffectIndex, 1);
      }

      // scale
      const existScaleEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'scale' && effect.index === field.queueIndex);
      if (newValue[object.uuid]?.scale) {
        if (existScaleEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].scale,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existScaleEffectIndex] = {
            ...newValue[object.uuid].scale,
            index: field.queueIndex,
          };
        }
      } else if (existScaleEffectIndex !== -1) {
        newObject.effects.splice(existScaleEffectIndex, 1);
      }

      // stroke
      const existStrokeEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'stroke' && effect.index === field.queueIndex);
      if (newValue[object.uuid]?.stroke) {
        if (existStrokeEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].stroke,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existStrokeEffectIndex] = {
            ...newValue[object.uuid].stroke,
            index: field.queueIndex,
          };
        }
      } else if (existStrokeEffectIndex !== -1) {
        newObject.effects.splice(existStrokeEffectIndex, 1);
      }

      // text
      const existTextEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'text' && effect.index === field.queueIndex);
      if (newValue[object.uuid]?.text) {
        if (existTextEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].text,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existTextEffectIndex] = {
            ...newValue[object.uuid].text,
            index: field.queueIndex,
          };
        }
      } else if (existTextEffectIndex !== -1) {
        newObject.effects.splice(existTextEffectIndex, 1);
      }

      /**
       * @description
       * Remove 이펙트가 변경된 경우, Remove 이펙트 이후 모든 이펙트를 제거해야 함
       */
      const existRemoveEffectIndex = newObject.effects.findIndex((effect) => effect.type === 'remove');
      if (newValue[object.uuid]?.remove) {
        if (existRemoveEffectIndex === -1) {
          newObject.effects.push({
            ...newValue[object.uuid].remove,
            index: field.queueIndex,
          });
        } else {
          newObject.effects[existRemoveEffectIndex] = {
            ...newValue[object.uuid].remove,
            index: field.queueIndex,
          };
        }
        newObject.effects = newObject.effects.filter((effect) => effect.index <= field.queueIndex);
      } else if (existRemoveEffectIndex !== -1) {
        newObject.effects.splice(existRemoveEffectIndex, 1);
      }

      newObject.effects.sort((a, b) => a.index - b.index);
      return newObject;
    });
    set(selector, newObjects);
  }
});

export interface ObjectQueueProps {
  [OBJECT_PROPERTY_META.FADE]: QueueFade;
  [OBJECT_PROPERTY_META.FILL]: QueueFill;
  [OBJECT_PROPERTY_META.RECT]: QueueRect;
  [OBJECT_PROPERTY_META.ROTATE]: QueueRotate;
  [OBJECT_PROPERTY_META.SCALE]: QueueScale;
  [OBJECT_PROPERTY_META.STROKE]: QueueStroke;
  [OBJECT_PROPERTY_META.TEXT]: QueueText;
}

/**
 * @description
 * 오브젝트 별로 pageIndex, queueIndex 에 해당하는 속성들을 관리하는 readonly 셀렉터
 * 이 셀렉터의 값은 해당 큐까지 모든 이펙트가 반영된 최종 값이다.
 */
export const objectQueueProps = selectorFamily<
  {
    [key: string]: ObjectQueueProps;
  },
  {
    pageIndex: number;
    queueIndex: number;
  }
>({
  key: 'objectQueueProps',
  get: (field) => ({ get }): { [key: string]: ObjectQueueProps } => {
    const objects = get(queueDocumentPageObjects(field.pageIndex));
    return objects.reduce<{ [key: string]: ObjectQueueProps }>((final, object) => {
      const props = object.effects
        .filter((effect) => effect.index <= field.queueIndex)
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
  }
});

/**
 * @description
 * 오브젝트 별로 pageIndex 에 해당하는 기본 속성들을 관리하기 위한 셀렉터
 * 이 셀렉터를 활용하면 오브젝트 기본 속성들의 읽기 / 생성 / 수정 / 삭제하는 과정을 간소화 할 수 있다.
 */
export const objectDefaultProps = selectorFamily<
  {
    [key: string]: ObjectQueueProps;
  },
  {
    pageIndex: number;
  }
>({
  key: 'objectDefaultProps',
  get: (field) => ({ get }): { [key: string]: ObjectQueueProps } => {
    const objects = get(queueDocumentPageObjects(field.pageIndex));
    return objects.reduce<{ [key: string]: ObjectQueueProps }>((final, object) => {
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
  },
  set: (field) => ({ get, set }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = queueDocumentPageObjects(field.pageIndex);
    const objects = get(selector);
    const newObjects = objects.map((object) => {
      const newObject = {
        ...object,
        fade: newValue[object.uuid][OBJECT_PROPERTY_META.FADE],
        fill: newValue[object.uuid][OBJECT_PROPERTY_META.FILL],
        rect: newValue[object.uuid][OBJECT_PROPERTY_META.RECT],
        rotate: newValue[object.uuid][OBJECT_PROPERTY_META.ROTATE],
        scale: newValue[object.uuid][OBJECT_PROPERTY_META.SCALE],
        stroke: newValue[object.uuid][OBJECT_PROPERTY_META.STROKE],
        text: newValue[object.uuid][OBJECT_PROPERTY_META.TEXT],
      };
      return newObject;
    });
    set(selector, newObjects);
  },
});
