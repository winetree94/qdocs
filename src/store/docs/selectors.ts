import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

const selectSelf = (state: RootState) => state.document;
export const selectDocs = createSelector(selectSelf, (docs) => docs);
