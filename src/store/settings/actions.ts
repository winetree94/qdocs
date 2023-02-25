import { createAction, EntityId } from '@reduxjs/toolkit';
import { QueueDocumentSettings } from './model';
import { DetailSelectionAction, NormalSelectionAction } from './reducer';

const rewind = createAction('settings/rewind');

const play = createAction('settings/play');

const updateSettings = createAction<{
  changes: Partial<QueueDocumentSettings>;
}>('settings/updateSettings');

const setSettings = createAction<QueueDocumentSettings>('settings/setSettings');

const setScale = createAction<number>('settings/setScale');

const increaseScale = createAction('settings/increaseScale');

const decreaseScale = createAction('settings/decreaseScale');

const movePage = createAction<{ pageIndex: string; pageId: number }>('settings/movePage');

const setSelection = createAction<DetailSelectionAction | NormalSelectionAction>('settings/setSelection');

const addSelection = createAction<EntityId>('settings/addSelection');

const removeSelection = createAction<EntityId[]>('settings/removeSelection');

const resetSelection = createAction('settings/resetSelection');

const setPresentationMode = createAction<boolean>('settings/setPresentationMode');

const setQueueIndex = createAction<{ queueIndex: number; play?: boolean }>('settings/setQueueIndex');

export const SettingsActions = {
  rewind,
  play,
  updateSettings,
  setSettings,
  setScale,
  increaseScale,
  decreaseScale,
  movePage,
  setSelection,
  addSelection,
  removeSelection,
  resetSelection,
  setPresentationMode,
  setQueueIndex,
};
