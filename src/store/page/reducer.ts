import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { loadDocument } from 'store/docs/actions';

export interface NormalizedQueueDocumentPage {
  uuid: string;
  pageName: string;
  objects: string[];
}

export const pageEntityAdapter = createEntityAdapter<NormalizedQueueDocumentPage>({
  selectId: (page) => page.uuid,
});

export const pagesSlice = createSlice({
  name: 'pages',
  initialState: pageEntityAdapter.getInitialState(),
  reducers: {
    setPages: pageEntityAdapter.setAll,
    addPage: pageEntityAdapter.addOne,
    removePage: pageEntityAdapter.removeOne,
    updatePage: pageEntityAdapter.updateOne,
  },
  extraReducers: (builder) => {
    /**
     * @deprecated
     * 레거시 액션 호환을 위해 유지
     */
    builder.addCase(loadDocument, (state, action) => {
      pageEntityAdapter.setAll(state, {
        ...action.payload.pages.map((page) => ({
          pageName: page.pageName,
          uuid: page.uuid,
          objects: page.objects.map((object) => object.uuid),
        })),
      });
    });
  },
});
