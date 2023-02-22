import { RootState } from 'store';
import { pageEntityAdapter } from './reducer';

const selectSelf = (state: RootState) => state.pages;
const selectors = pageEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const byId = selectors.selectById;
const entities = selectors.selectEntities;
const ids = selectors.selectIds;
const total = selectors.selectTotal;

export const PageSelectors = {
  all,
  byId,
  entities,
  ids,
  total,
};
