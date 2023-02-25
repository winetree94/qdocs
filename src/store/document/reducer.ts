/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { QueueDocument } from 'model/document';
import { loadDocument } from 'store/document/actions';

export type NormalizedQueueDocument = Omit<QueueDocument, 'pages'>;

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
