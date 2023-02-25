import { createSlice } from '@reduxjs/toolkit';
import { loadDocument } from 'store/document/actions';
import { NormalizedQueueDocument } from './model';

export const documentSlice = createSlice({
  name: 'document',
  initialState: null as NormalizedQueueDocument,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action): NormalizedQueueDocument => {
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
