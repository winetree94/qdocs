import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { QueueEffectType } from 'model/effect';
import { DocumentActions } from '../document';
import { EffectActions } from './actions';

export const getEffectEntityKey = (
  effect: Pick<QueueEffectType, 'index' | 'objectId' | 'type'>,
) => `${effect.objectId}-${effect.index}-${effect.type}`;

export const effectEntityAdapter = createEntityAdapter<QueueEffectType>({
  selectId: getEffectEntityKey,
});

export const effectSlice = createSlice({
  name: 'effects',
  initialState: effectEntityAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DocumentActions.loadDocument, (state, action) => {
      if (!action.payload) {
        return effectSlice.getInitialState();
      }
      return action.payload.effects;
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
