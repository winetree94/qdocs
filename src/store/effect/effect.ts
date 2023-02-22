import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { QueueEffectType } from 'model/effect';
import { loadDocument } from 'store/docs/actions';

export type NormalizedQueueEffect = {
  uuid: string;
} & QueueEffectType;

const effectEntityAdapter = createEntityAdapter<NormalizedQueueEffect>({
  selectId: (object) => object.uuid,
});

export const effectSlice = createSlice({
  name: 'effects',
  initialState: effectEntityAdapter.getInitialState(),
  reducers: {
    setObjects: effectEntityAdapter.setAll,
    addObject: effectEntityAdapter.addOne,
    removeObject: effectEntityAdapter.removeOne,
    updateObject: effectEntityAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action) => {
      const normalized = action.payload.pages.reduce<NormalizedQueueEffect[]>((result, page) => {
        page.objects.forEach((object) => {
          object.effects.forEach((effect) => {
            result.push({
              uuid: object.uuid,
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
