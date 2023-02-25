import { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { ObjectSelectors } from 'store/object/selectors';
import { PageSelectors } from 'store/page/selectors';
import { QueueDocumentSettings } from './reducer';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const settings = createSelector(selectSelf, (state) => state);

const documentId = createSelector(selectSelf, (state) => state.documentId);

const currentPageId = createSelector(
  [selectSelf, PageSelectors.ids],
  (settings, pageIds) => pageIds[settings.queuePage],
);

const selectedObjects = createSelector([selectSelf, ObjectSelectors.entities], (settings, objectEntities) =>
  settings.selectedObjectIds.map((id) => objectEntities[id]),
);

export const SettingSelectors = {
  settings,
  documentId,
  currentPageId,
  selectedObjects,
};
