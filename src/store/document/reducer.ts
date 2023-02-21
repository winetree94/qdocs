import { createReducer } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { QueueDocument } from 'model/document';
import { OBJECT_PROPERTY_META } from 'model/meta';
import { setDocument, setObjectCurrentBasesEffect, setObjectDefaultProps, setObjectQueueEffects, setPageObjects, setPageObjectsByUUID, setPages } from './actions';
export const documentReducer = createReducer<QueueDocument>(null, builder => {
  builder.addCase(setDocument, (state, action) => {
    return action.payload;
  });

  builder.addCase(setPages, (state, action) => {
    if (!state) return null;
    return {
      ...state,
      pages: action.payload,
    };
  });

  builder.addCase(setPageObjects, (state, action) => {
    if (!state) return null;
    return {
      ...state,
      pages: state.pages.map((page, index) => {
        if (index !== action.payload.page) return page;
        return {
          ...page,
          objects: action.payload.objects,
        };
      }),
    };
  });

  builder.addCase(setPageObjectsByUUID, (state, action) => {
    if (!state) return null;
    return {
      ...state,
      pages: state.pages.map((page, index) => {
        if (index !== action.payload.page) return page;
        return {
          ...page,
          objects: page.objects.map((object) => {
            if (!action.payload.objects[object.uuid]) return object;
            return {
              ...object,
              ...action.payload.objects[object.uuid],
            };
          }),
        };
      }),
    };
  });

  builder.addCase(setObjectQueueEffects, (state, action) => {
    if (!state) return null;
    const objects = state.pages[action.payload.page].objects ?? [];
    const newObjects = objects.map((object) => {
      const newObject = cloneDeep(object);
      const existCreateEffectIndex = newObject.effects.findIndex((effect) => effect.type === 'create');

      /**
       * @description
       * 만약 오브젝트가 생성된 큐에서 이펙트를 변화시키는 경우,
       * 이펙트에 추가하지 않고 오브젝트의 속성을 업데이트 시킨다.
       * 편의성 때문에 여기서 넣었는데 이게 맞는지는 고민이 필요
       */
      if (newObject.effects[existCreateEffectIndex].index === action.payload.queueIndex) {
        newObject.fade = action.payload.effects[object.uuid].fade?.fade || newObject.fade;
        newObject.fill = action.payload.effects[object.uuid].fill?.fill || newObject.fill;
        newObject.rect = action.payload.effects[object.uuid].rect?.rect || newObject.rect;
        newObject.rotate = action.payload.effects[object.uuid].rotate?.rotate || newObject.rotate;
        newObject.scale = action.payload.effects[object.uuid].scale?.scale || newObject.scale;
        newObject.stroke = action.payload.effects[object.uuid].stroke?.stroke || newObject.stroke;
        newObject.text = action.payload.effects[object.uuid].text?.text || newObject.text;
        return newObject;
      }

      // fade
      const existFadeEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'fade' && effect.index === action.payload.queueIndex);
      if (action.payload.effects[object.uuid]?.fade) {
        if (existFadeEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].fade,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existFadeEffectIndex] = {
            ...action.payload.effects[object.uuid].fade,
            index: action.payload.queueIndex,
          };
        }
      } else if (existFadeEffectIndex !== -1) {
        newObject.effects.splice(existFadeEffectIndex, 1);
      }

      // fill
      const existFillEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'fill' && effect.index === action.payload.queueIndex);
      if (action.payload.effects[object.uuid]?.fill) {
        if (existFillEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].fill,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existFillEffectIndex] = {
            ...action.payload.effects[object.uuid].fill,
            index: action.payload.queueIndex,
          };
        }
      } else if (existFillEffectIndex !== -1) {
        newObject.effects.splice(existFillEffectIndex, 1);
      }

      // rect
      const existRectEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'rect' && effect.index === action.payload.queueIndex);
      if (action.payload.effects[object.uuid]?.rect) {
        if (existRectEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].rect,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existRectEffectIndex] = {
            ...action.payload.effects[object.uuid].rect,
            index: action.payload.queueIndex,
          };
        }
      } else if (existRectEffectIndex !== -1) {
        newObject.effects.splice(existRectEffectIndex, 1);
      }

      // rotate
      const existRotateEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'rotate' && effect.index === action.payload.queueIndex);
      if (action.payload.effects[object.uuid]?.rotate) {
        if (existRotateEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].rotate,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existRotateEffectIndex] = {
            ...action.payload.effects[object.uuid].rotate,
            index: action.payload.queueIndex,
          };
        }
      } else if (existRotateEffectIndex !== -1) {
        newObject.effects.splice(existRotateEffectIndex, 1);
      }

      // scale
      const existScaleEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'scale' && effect.index === action.payload.queueIndex);
      if (action.payload.effects[object.uuid]?.scale) {
        if (existScaleEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].scale,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existScaleEffectIndex] = {
            ...action.payload.effects[object.uuid].scale,
            index: action.payload.queueIndex,
          };
        }
      } else if (existScaleEffectIndex !== -1) {
        newObject.effects.splice(existScaleEffectIndex, 1);
      }

      // stroke
      const existStrokeEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'stroke' && effect.index === action.payload.queueIndex);
      if (action.payload.effects[object.uuid]?.stroke) {
        if (existStrokeEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].stroke,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existStrokeEffectIndex] = {
            ...action.payload.effects[object.uuid].stroke,
            index: action.payload.queueIndex,
          };
        }
      } else if (existStrokeEffectIndex !== -1) {
        newObject.effects.splice(existStrokeEffectIndex, 1);
      }

      // text
      const existTextEffectIndex = newObject.effects
        .findIndex((effect) => effect.type === 'text' && effect.index === action.payload.queueIndex);
      if (action.payload.effects[object.uuid]?.text) {
        if (existTextEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].text,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existTextEffectIndex] = {
            ...action.payload.effects[object.uuid].text,
            index: action.payload.queueIndex,
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
      if (action.payload.effects[object.uuid]?.remove) {
        if (existRemoveEffectIndex === -1) {
          newObject.effects.push({
            ...action.payload.effects[object.uuid].remove,
            index: action.payload.queueIndex,
          });
        } else {
          newObject.effects[existRemoveEffectIndex] = {
            ...action.payload.effects[object.uuid].remove,
            index: action.payload.queueIndex,
          };
        }
        newObject.effects = newObject.effects.filter((effect) => effect.index <= action.payload.queueIndex);
      } else if (existRemoveEffectIndex !== -1) {
        newObject.effects.splice(existRemoveEffectIndex, 1);
      }

      newObject.effects.sort((a, b) => a.index - b.index);
      return newObject;
    });

    return {
      ...state,
      pages: [
        ...state.pages.slice(0, action.payload.page),
        {
          ...state.pages[action.payload.page],
          objects: newObjects,
        },
        ...state.pages.slice(action.payload.page + 1),
      ]
    };
  });

  builder.addCase(setObjectDefaultProps, (state, action) => {
    const objects = state.pages[action.payload.page].objects;
    const newObjects = objects.map((object) => {
      const newObject = {
        ...object,
        fade: action.payload.props[object.uuid][OBJECT_PROPERTY_META.FADE],
        fill: action.payload.props[object.uuid][OBJECT_PROPERTY_META.FILL],
        rect: action.payload.props[object.uuid][OBJECT_PROPERTY_META.RECT],
        rotate: action.payload.props[object.uuid][OBJECT_PROPERTY_META.ROTATE],
        scale: action.payload.props[object.uuid][OBJECT_PROPERTY_META.SCALE],
        stroke: action.payload.props[object.uuid][OBJECT_PROPERTY_META.STROKE],
        text: action.payload.props[object.uuid][OBJECT_PROPERTY_META.TEXT],
      };
      return newObject;
    });
    return {
      ...state,
      pages: [
        ...state.pages.slice(0, action.payload.page),
        {
          ...state.pages[action.payload.page],
          objects: newObjects,
        },
        ...state.pages.slice(action.payload.page + 1),
      ]
    };
  });

  builder.addCase(setObjectCurrentBasesEffect, (state, action) => {
    const objects = state.pages[action.payload.page].objects;

    const newObjects = objects.map((object) => {
      if (!action.payload.uuid.includes(object.uuid)) {
        return object;
      }

      const existObject = object;
      const newObject = cloneDeep(existObject);
      const currentQueueEffectIndex = newObject.effects.findIndex(
        (effect) => effect.index === action.payload.queueIndex
      );

      newObject.effects[currentQueueEffectIndex] = {
        ...newObject.effects[currentQueueEffectIndex],
        ...action.payload.effects[object.uuid],
      };

      newObject.effects.sort((a, b) => a.index - b.index);

      return newObject;
    });

    return {
      ...state,
      pages: [
        ...state.pages.slice(0, action.payload.page),
        {
          ...state.pages[action.payload.page],
          objects: newObjects,
        },
        ...state.pages.slice(action.payload.page + 1),
      ],
    };
  });

});
