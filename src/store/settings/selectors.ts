import { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { ObjectSelectors } from 'store/object/selectors';
import { QueueDocumentSettings } from './model';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const settings = createSelector(selectSelf, (state) => state);

const documentId = createSelector(selectSelf, (state) => state.documentId);

const pageId = createSelector(selectSelf, (settings) => settings.queuePage);

const queueIndex = createSelector(selectSelf, (state) => state.queueIndex);

const selectedObjects = createSelector([selectSelf, ObjectSelectors.entities], (settings, objectEntities) =>
  settings.selectedObjectIds.map((id) => objectEntities[id]),
);

export const SettingSelectors = {
  settings,
  documentId,
  pageId,
  queueIndex,
  selectedObjects,
};
