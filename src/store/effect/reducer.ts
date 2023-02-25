import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueueEffectType } from 'model/effect';
import { loadDocument } from 'store/document/actions';

export type NormalizedQueueEffect = QueueEffectType;

export const getEffectEntityKey = (effect: Pick<NormalizedQueueEffect, 'index' | 'objectId' | 'type'>) =>
  `${effect.objectId}-${effect.index}-${effect.type}`;

export const effectEntityAdapter = createEntityAdapter<NormalizedQueueEffect>({
  selectId: getEffectEntityKey,
});

export const effectSlice = createSlice({
  name: 'effects',
  initialState: effectEntityAdapter.getInitialState(),
  reducers: {
    addEffect: (state, action: PayloadAction<NormalizedQueueEffect>) => {
      return effectEntityAdapter.addOne(state, action);
    },
    upsertEffect: (state, action: PayloadAction<NormalizedQueueEffect>) => {
      return effectEntityAdapter.upsertOne(state, action);
    },
    upsertEffects: (state, action: PayloadAction<NormalizedQueueEffect[]>) => {
      return effectEntityAdapter.upsertMany(state, action);
    },
    removeMany: (state, action: PayloadAction<string[]>) => {
      return effectEntityAdapter.removeMany(state, action);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action) => {
      const normalized = action.payload.pages.reduce<NormalizedQueueEffect[]>((result, page) => {
        page.objects.forEach((object) => {
          object.effects.forEach((effect) => {
            result.push({
              objectId: object.uuid,
              duration: effect.duration,
              index: effect.index,
              prop: effect.prop,
              timing: effect.timing,
              type: effect.type,
              ...effect,
            });
          });
        });
        return result;
      }, []);
      return effectEntityAdapter.setAll(state, normalized);
    });
  },
});
