import { RootState } from 'store';
import { objectEntityAdapter } from './reducer';

const selectSelf = (state: RootState) => state.objects;
const selectors = objectEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const byId = selectors.selectById;
const entities = selectors.selectEntities;
const ids = selectors.selectIds;
const total = selectors.selectTotal;

export const ObjectSelectors = {
  all,
  byId,
  entities,
  ids,
  total,
};
