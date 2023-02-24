import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { objectEntityAdapter } from './reducer';

const selectSelf = (state: RootState) => state.objects;
const selectors = objectEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const byId = selectors.selectById;
const entities = selectors.selectEntities;
const ids = selectors.selectIds;
const total = selectors.selectTotal;

const allByPageId = createSelector([all, (_: RootState, id: string) => id], (objects, id) => {
  return objects.filter((object) => object.pageId === id);
});

const idSetOfPageId = createSelector([allByPageId], (objects) => {
  return new Set<string>(objects.map(({ uuid }) => uuid));
});

export const ObjectSelectors = {
  all,
  byId,
  entities,
  ids,
  total,
  allByPageId,
  idSetOfPageId,
};