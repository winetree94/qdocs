import { createEntityAdapter, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { QueueDocumentPage } from 'model/document';
import { loadDocument } from 'store/document/actions';

export interface NormalizedQueueDocumentPage extends Omit<QueueDocumentPage, 'objects'> {
  index: number;
  documentId: string;
}

export const pageEntityAdapter = createEntityAdapter<NormalizedQueueDocumentPage>({
  selectId: (page) => page.id,
  sortComparer: (a, b) => a.index - b.index,
});

export const pagesSlice = createSlice({
  name: 'pages',
  initialState: pageEntityAdapter.getInitialState(),
  reducers: {
    addPage: pageEntityAdapter.addOne,
    removePage: pageEntityAdapter.removeOne,
    updatePage: pageEntityAdapter.updateOne,
    updatePages: pageEntityAdapter.updateMany,

    switchPageIndex: (
      state,
      action: PayloadAction<{
        from: EntityId;
        to: EntityId;
      }>,
    ) => {
      const { from, to } = action.payload;
      const fromPage = state.entities[from];
      const toPage = state.entities[to];

      if (!fromPage || !toPage) {
        console.error(`${action.type} - page not found`);
        return state;
      }

      const fromIndex = fromPage.index;
      const toIndex = toPage.index;
      toPage.index = fromIndex;
      fromPage.index = toIndex;

      return pageEntityAdapter.updateMany(state, [
        { id: from, changes: fromPage },
        { id: to, changes: toPage },
      ]);
    },

    copyPage: (
      state,
      action: PayloadAction<{
        fromId: EntityId;
        newId: string;
        index: number;
      }>,
    ) => {
      const page = state.entities[action.payload.fromId];

      if (!page) {
        console.error(`${action.type} - page not found`);
        return state;
      }

      const newPage: NormalizedQueueDocumentPage = {
        ...page,
        id: action.payload.newId,
        index: action.payload.index,
        pageName: `${page.pageName} (copy)`,
      };

      return pageEntityAdapter.addOne(state, newPage);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadDocument, (state, action) => {
      return pageEntityAdapter.setAll(state, {
        ...action.payload.pages.map((page, index) => ({
          documentId: action.payload.id,
          pageName: page.pageName,
          index: index,
          id: page.id,
        })),
      });
    });
  },
});
