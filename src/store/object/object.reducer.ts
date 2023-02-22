import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OBJECT_PROPERTY_META } from 'model/meta';
import { QueueObjectType } from 'model/object';
import { loadDocument } from 'store/document/actions';
import { ObjectQueueEffects, ObjectQueueProps } from 'store/legacy/selectors';

export const objectEntityAdapter = createEntityAdapter<QueueObjectType>({
  selectId: (object) => object.uuid,
});

export const objectsSlice = createSlice({
  name: 'objects',
  initialState: objectEntityAdapter.getInitialState(),
  reducers: {
    setObjects: objectEntityAdapter.setAll,
    addObject: objectEntityAdapter.addOne,
    removeObject: objectEntityAdapter.removeOne,
    removeObjects: objectEntityAdapter.removeMany,
    updateObject: objectEntityAdapter.updateOne,
    updateObjects: objectEntityAdapter.updateMany,

    setObjectQueueEffects: (
      state,
      action: PayloadAction<{
        page: number;
        queueIndex: number;
        effects: { [key: string]: ObjectQueueEffects };
      }>,
    ) => {
      if (!state) return null;
      const objects: QueueObjectType[] = state.ids.map((id) => state.entities[id]!);

      const newObjects = objects.map((object) => {
        const newObject = { ...object, effects: [...object.effects] };
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
        const existFadeEffectIndex = newObject.effects.findIndex(
          (effect) => effect.type === 'fade' && effect.index === action.payload.queueIndex,
        );
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
        const existFillEffectIndex = newObject.effects.findIndex(
          (effect) => effect.type === 'fill' && effect.index === action.payload.queueIndex,
        );
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
        const existRectEffectIndex = newObject.effects.findIndex(
          (effect) => effect.type === 'rect' && effect.index === action.payload.queueIndex,
        );
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
        const existRotateEffectIndex = newObject.effects.findIndex(
          (effect) => effect.type === 'rotate' && effect.index === action.payload.queueIndex,
        );
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
        const existScaleEffectIndex = newObject.effects.findIndex(
          (effect) => effect.type === 'scale' && effect.index === action.payload.queueIndex,
        );
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
        const existStrokeEffectIndex = newObject.effects.findIndex(
          (effect) => effect.type === 'stroke' && effect.index === action.payload.queueIndex,
        );
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
        const existTextEffectIndex = newObject.effects.findIndex(
          (effect) => effect.type === 'text' && effect.index === action.payload.queueIndex,
        );
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

      return objectEntityAdapter.updateMany(
        state,
        newObjects.map((object) => ({ id: object.uuid, changes: object })),
      );
    },

    setObjectDefaultProps: (
      state,
      action: PayloadAction<{
        page: number;
        queueIndex: number;
        props: { [key: string]: ObjectQueueProps };
      }>,
    ) => {
      const objects = state.ids.map((id) => state.entities[id]);
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
      return objectEntityAdapter.updateMany(
        state,
        newObjects.map((object) => ({ id: object.uuid, changes: object })),
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action) => {
      const normalized = action.payload.pages.reduce<QueueObjectType[]>((result, page) => {
        page.objects.forEach((object) => {
          result.push(object);
        });
        return result;
      }, []);
      objectEntityAdapter.setAll(state, normalized);
    });
  },
});
