import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueueDocumentRect } from 'model/document';
import { loadDocument } from 'store/docs/actions';

export interface NormalizedQueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  pages: string[];
}

export const docsSlice = createSlice({
  name: 'document',
  initialState: null as NormalizedQueueDocument,
  reducers: {
    setDocument: (state, action) => action.payload,

    updateDocs: (state, action) => ({ ...state, ...action.payload }),

    addPageToIndex: (state, action: PayloadAction<{ pageId: string; index: number }>) => {
      const { pageId, index } = action.payload;
      state.pages.splice(index, 0, pageId);
    },

    removePage: (state, action: PayloadAction<string>) => {
      const pageId = action.payload;
      state.pages = state.pages.filter((page) => page !== pageId);
    },

    changePageIndex: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const page = state.pages[fromIndex];
      state.pages.splice(fromIndex, 1);
      state.pages.splice(toIndex, 0, page);
    },

    clearDocs: () => null,
  },
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action) => {
      return {
        ...state,
        documentName: action.payload.documentName,
        documentRect: action.payload.documentRect,
        pages: action.payload.pages.map((page) => page.uuid),
      };
    });
  },
});
