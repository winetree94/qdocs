import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { QueueDocumentSettings } from './reducer';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const settings = createSelector(selectSelf, (state) => state);

export const SettingSelectors = {
  settings,
};
