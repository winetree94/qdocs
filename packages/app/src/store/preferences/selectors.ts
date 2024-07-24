import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@legacy/store';

const selectSelf = (state: RootState) => state.perferences;
const all = createSelector(selectSelf, (state) => state);
const language = createSelector(selectSelf, (state) => state.language);

export const PreferencesSelectors = {
  all,
  language,
};
