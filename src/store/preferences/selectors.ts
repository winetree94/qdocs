import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

const selectSelf = (state: RootState) => state.perferences;
const all = createSelector(selectSelf, (state) => state);

export const PreferencesSelectors = {
  all,
};
