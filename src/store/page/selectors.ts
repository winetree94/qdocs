import { RootState } from 'store';
import { pageEntityAdapter } from './reducer';

const selectSelf = (state: RootState) => state.pages;

const selectPages = pageEntityAdapter.getSelectors(selectSelf).selectAll;
const selectPageEntries = pageEntityAdapter.getSelectors(selectSelf).selectEntities;

export const PageSelectors = {
  selectPages,
  selectPageEntries,
};
