import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { PageSelectors } from 'store/page/selectors';
import { QueueDocumentSettings } from './reducer';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const settings = createSelector(selectSelf, (state) => state);

const currentPageUUID = createSelector(
  [selectSelf, PageSelectors.ids],
  (settings, pageIds) => pageIds[settings.queuePage],
);

export const SettingSelectors = {
  settings,
  currentPageUUID,
};
