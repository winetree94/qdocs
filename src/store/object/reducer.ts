import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { NormalizedQueueObjectType } from './model';
import { DocumentActions } from '../document';
import { ObjectActions } from './actions';

export const objectEntityAdapter = createEntityAdapter<NormalizedQueueObjectType>({
  selectId: (object) => object.id,
});

export const objectsSlice = createSlice({
  name: 'objects',
  initialState: objectEntityAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DocumentActions.loadDocument, (state, action) => {
      if (!action.payload) {
        return objectsSlice.getInitialState();
      }
      const normalized = action.payload.pages.reduce<NormalizedQueueObjectType[]>((result, page) => {
        page.objects.forEach((object) => {
          const normalizedObject = {
            pageId: page.id,
            ...object,
          };
          delete normalizedObject.effects; // 레거시 셀렉터에 의해서 값이 들어가는 것을 방지
          result.push(normalizedObject);
        });
        return result;
      }, []);
      return objectEntityAdapter.setAll(state, normalized);
    });

    builder.addCase(ObjectActions.addOne, (state, action) => {
      return objectEntityAdapter.addOne(state, action.payload.object);
    });

    builder.addCase(ObjectActions.addMany, (state, action) => {
      return objectEntityAdapter.addMany(state, action.payload.objects);
    });

    builder.addCase(ObjectActions.updateObject, (state, action) => {
      return objectEntityAdapter.updateOne(state, action.payload);
    });

    builder.addCase(ObjectActions.updateObjects, (state, action) => {
      return objectEntityAdapter.updateMany(state, action.payload);
    });

    builder.addCase(ObjectActions.removeMany, (state, action) => {
      return objectEntityAdapter.removeMany(state, action.payload);
    });
  },
});
