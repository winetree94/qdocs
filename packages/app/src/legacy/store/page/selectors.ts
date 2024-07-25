import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@legacy/store';
import { pageEntityAdapter } from './reducer';

const selectSelf = (state: RootState) => state.pages;
const selectors = pageEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const byId = selectors.selectById;
const entities = selectors.selectEntities;
const ids = selectors.selectIds;
const total = selectors.selectTotal;

const allByDocumentId = createSelector(
  [all, (_: RootState, id: string) => id],
  (pages, id) => {
    return pages.filter((page) => page.documentId === id);
  },
);

export const PageSelectors = {
  all,
  byId,
  entities,
  ids,
  total,
  allByDocumentId,
};
