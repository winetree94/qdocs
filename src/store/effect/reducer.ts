import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { NormalizedQueueEffect } from './model';
import { DocumentActions } from '../document';
import { EffectActions } from './actions';

export const getEffectEntityKey = (effect: Pick<NormalizedQueueEffect, 'index' | 'objectId' | 'type'>) =>
  `${effect.objectId}-${effect.index}-${effect.type}`;

export const effectEntityAdapter = createEntityAdapter<NormalizedQueueEffect>({
  selectId: getEffectEntityKey,
});

export const effectSlice = createSlice({
  name: 'effects',
  initialState: effectEntityAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DocumentActions.loadDocument, (state, action) => {
      const normalized = action.payload.pages.reduce<NormalizedQueueEffect[]>((result, page) => {
        page.objects.forEach((object) => {
          object.effects.forEach((effect) => {
            result.push({
              objectId: object.id,
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

    builder.addCase(EffectActions.addEffect, (state, action) => {
      return effectEntityAdapter.addOne(state, action);
    });

    builder.addCase(EffectActions.upsertEffect, (state, action) => {
      return effectEntityAdapter.upsertOne(state, action);
    });

    builder.addCase(EffectActions.upsertEffects, (state, action) => {
      return effectEntityAdapter.upsertMany(state, action);
    });

    builder.addCase(EffectActions.removeMany, (state, action) => {
      return effectEntityAdapter.removeMany(state, action);
    });
  },
});
