import { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { ObjectSelectors } from 'store/object/selectors';
import { QueueDocumentSettings } from './model';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const pageId = createSelector(selectSelf, (settings) => settings.pageId);

const queueIndex = createSelector(selectSelf, (state) => state.queueIndex);

const queuePosition = createSelector(
  selectSelf,
  (state) => state.queuePosition,
);

const queueStart = createSelector(selectSelf, (state) => state.queueStart);

const autoPlay = createSelector(selectSelf, (settings) => settings.autoPlay);

const scale = createSelector(selectSelf, (settings) => settings.scale);

const leftPanelOpened = createSelector(
  selectSelf,
  (settings) => settings.leftPanelOpened,
);

const bottomPanelOpened = createSelector(
  selectSelf,
  (settings) => settings.bottomPanelOpened,
);

const selectionMode = createSelector(
  selectSelf,
  (settings) => settings.selectionMode,
);

const presentationMode = createSelector(
  selectSelf,
  (settings) => settings.presentationMode,
);

const selectedObjectIds = createSelector(
  selectSelf,
  (settings) => settings.selectedObjectIds,
);

const autoPlayRepeat = createSelector(
  selectSelf,
  (settings) => settings.autoPlayRepeat,
);

const pageObjects = createSelector(
  [selectSelf, ObjectSelectors.all],
  (settings, objects) =>
    objects.filter((object) => object.pageId === settings.pageId),
);

const pageObjectIds = createSelector(
  [selectSelf, ObjectSelectors.byPageId],
  (settings, objects) => {
    return objects[settings.pageId]?.map(({ id }) => id) || [];
  },
);

const selectedObjects = createSelector(
  [selectSelf, ObjectSelectors.entities],
  (settings, objectEntities) =>
    settings.selectedObjectIds.map((id) => objectEntities[id]),
);

export const SettingSelectors = {
  pageId,
  queueIndex,
  autoPlayRepeat,
  pageObjects,
  pageObjectIds,
  selectedObjects,
  selectedObjectIds,
  selectionMode,
  scale,
  queuePosition,
  presentationMode,
  queueStart,
  autoPlay,
  leftPanelOpened,
  bottomPanelOpened,
};
