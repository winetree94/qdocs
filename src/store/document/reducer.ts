import { createSlice } from '@reduxjs/toolkit';
import { NormalizedQueueDocument } from './model';
import { DocumentActions } from './actions';

export const documentSlice = createSlice({
  name: 'document',
  initialState: null as NormalizedQueueDocument,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      DocumentActions.loadDocument,
      (state, action): NormalizedQueueDocument => {
        if (!action.payload) {
          return null;
        }
        return action.payload.document;
      },
    );

    builder.addCase(DocumentActions.changeName, (state, action) => {
      state.documentName = action.payload;
    });
  },
});
