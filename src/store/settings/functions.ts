import { EntityId } from '@reduxjs/toolkit';
import { RootState } from 'store';

export const getPageObjectIds = (state: RootState, pageId: EntityId) => {
  if (!state || !pageId) {
    return null;
  }

  return state.objects.ids.filter(
    (id) => state.objects.entities[id].pageId === pageId,
  );
};

export const getSelectedObjects = (state: RootState) => {
  if (!state || !state.settings) {
    return null;
  }

  return state.settings.selectedObjectIds.map(
    (id) => state.objects.entities[id],
  );
};
