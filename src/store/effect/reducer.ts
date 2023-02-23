import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { QueueEffectType } from 'model/effect';
import { loadDocument } from 'store/document/actions';

export type NormalizedQueueEffect = {
  uuid: string;
  objectId: string;
} & QueueEffectType;

export const getEffectEntityKey = (effect: NormalizedQueueEffect) =>
  `${effect.objectId}-${effect.index}-${effect.type}`;

export const effectEntityAdapter = createEntityAdapter<NormalizedQueueEffect>({
  selectId: getEffectEntityKey,
});

export const effectSlice = createSlice({
  name: 'effects',
  initialState: effectEntityAdapter.getInitialState(),
  reducers: {
    setEffects: effectEntityAdapter.setAll,
    addEffect: effectEntityAdapter.addOne,
    removeEffect: effectEntityAdapter.removeOne,
    updateEffect: effectEntityAdapter.updateOne,
    upsertEffects: effectEntityAdapter.upsertMany,
  },
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action) => {
      const normalized = action.payload.pages.reduce<NormalizedQueueEffect[]>((result, page) => {
        page.objects.forEach((object) => {
          object.effects.forEach((effect) => {
            result.push({
              uuid: effect.uuid,
              objectId: object.uuid,
              ...effect,
            });
          });
        });
        return result;
      }, []);
      effectEntityAdapter.setAll(state, normalized);
    });
  },
});
