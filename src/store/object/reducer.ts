import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueueObjectType } from 'model/object';
import { loadDocument } from 'store/document/actions';

export interface NormalizedQueueObjectType extends Omit<QueueObjectType, 'effects'> {
  pageId: string;
}

export const objectEntityAdapter = createEntityAdapter<NormalizedQueueObjectType>({
  selectId: (object) => object.uuid,
});

export const objectsSlice = createSlice({
  name: 'objects',
  initialState: objectEntityAdapter.getInitialState(),
  reducers: {
    addOne: (
      state,
      action: PayloadAction<{
        queueIndex?: number;
        object: NormalizedQueueObjectType;
      }>,
    ) => {
      return objectEntityAdapter.addOne(state, action.payload.object);
    },

    addMany: (
      state,
      action: PayloadAction<{
        queueIndex?: number;
        objects: NormalizedQueueObjectType[];
      }>,
    ) => {
      return objectEntityAdapter.addMany(state, action.payload.objects);
    },

    updateObject: objectEntityAdapter.updateOne,

    updateObjects: objectEntityAdapter.updateMany,

    removeMany: objectEntityAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action) => {
      const normalized = action.payload.pages.reduce<NormalizedQueueObjectType[]>((result, page) => {
        page.objects.forEach((object) => {
          result.push({
            pageId: page.uuid,
            ...object,
          });
        });
        return result;
      }, []);
      return objectEntityAdapter.setAll(state, normalized);
    });
  },
});
