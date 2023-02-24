import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { ObjectSelectors } from 'store/object/selectors';
import { PageSelectors } from 'store/page/selectors';
import { QueueDocumentSettings } from './reducer';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const settings = createSelector(selectSelf, (state) => state);

const currentPageUUID = createSelector(
  [selectSelf, PageSelectors.ids],
  (settings, pageIds) => pageIds[settings.queuePage],
);

const selectedObjects = createSelector([selectSelf, ObjectSelectors.entities], (settings, objectEntities) =>
  settings.selectedObjectUUIDs.map((uuid) => objectEntities[uuid]),
);

export const SettingSelectors = {
  settings,
  currentPageUUID,
  selectedObjects,
};
