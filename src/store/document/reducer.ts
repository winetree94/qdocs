import { createSlice } from '@reduxjs/toolkit';
import { NormalizedQueueDocument } from './model';
import { DocumentActions } from './actions';

export const documentSlice = createSlice({
  name: 'document',
  initialState: null as NormalizedQueueDocument,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DocumentActions.loadDocument, (state, action): NormalizedQueueDocument => {
      return {
        id: action.payload.id,
        documentName: action.payload.documentName,
        documentRect: {
          fill: action.payload.documentRect.fill,
          width: action.payload.documentRect.width,
          height: action.payload.documentRect.height,
        },
      };
    });
  },
});
