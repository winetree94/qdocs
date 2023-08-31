import { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { ObjectSelectors } from 'store/object/selectors';
import { QueueDocumentSettings } from './model';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const settings = createSelector(selectSelf, (state) => state);

const documentId = createSelector(selectSelf, (state) => state.documentId);

const pageId = createSelector(selectSelf, (settings) => settings.pageId);

const queueIndex = createSelector(selectSelf, (state) => state.queueIndex);

const pageObjects = createSelector(
  [selectSelf, ObjectSelectors.all],
  (settings, objects) =>
    objects.filter((object) => object.pageId === settings.pageId),
);

const selectedObjects = createSelector(
  [selectSelf, ObjectSelectors.entities],
  (settings, objectEntities) =>
    settings.selectedObjectIds.map((id) => objectEntities[id]),
);

const selectedObjectIds = createSelector(
  [selectSelf, ObjectSelectors.ids],
  (settings, objectIds) =>
    objectIds.filter((id) => settings.selectedObjectIds.includes(id)),
);

export const SettingSelectors = {
  settings,
  documentId,
  pageId,
  queueIndex,
  pageObjects,
  selectedObjects,
  selectedObjectIds,
};
