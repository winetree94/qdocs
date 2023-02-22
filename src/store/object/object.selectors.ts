import { RootState } from 'store';
import { objectEntityAdapter } from './object.reducer';

const selectSelf = (state: RootState) => state.objects;

const selectObjects = objectEntityAdapter.getSelectors(selectSelf).selectAll;

export const ObjectSelectors = {
  selectObjects,
};
