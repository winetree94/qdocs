import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { NormalizedQueueDocumentPage } from './model';
import { DocumentActions } from '../document';
import { PageActions } from './actions';

export const pageEntityAdapter =
  createEntityAdapter<NormalizedQueueDocumentPage>({
    selectId: (page) => page.id,
    sortComparer: (a, b) => a.index - b.index,
  });

export const pagesSlice = createSlice({
  name: 'pages',
  initialState: pageEntityAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(PageActions.addPage, (state, action) => {
      return pageEntityAdapter.addOne(state, action.payload);
    });

    builder.addCase(PageActions.removePage, (state, action) => {
      return pageEntityAdapter.removeOne(state, action.payload);
    });

    builder.addCase(PageActions.updatePage, (state, action) => {
      return pageEntityAdapter.updateOne(state, action.payload);
    });

    builder.addCase(PageActions.updatePages, (state, action) => {
      return pageEntityAdapter.updateMany(state, action.payload);
    });

    builder.addCase(PageActions.switchPageIndex, (state, action) => {
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
    });

    builder.addCase(PageActions.copyPage, (state, action) => {
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
    });

    builder.addCase(DocumentActions.loadDocument, (state, action) => {
      if (!action.payload) {
        return pagesSlice.getInitialState();
      }

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
