import { RootState } from 'store';
import { objectEntityAdapter } from './object.reducer';

const selectSelf = (state: RootState) => state.objects;
export const selectObjects = objectEntityAdapter.getSelectors(selectSelf).selectAll;
