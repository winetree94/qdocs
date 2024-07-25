import { createAction } from '@reduxjs/toolkit';

const Clear = createAction('history/clear');
const Capture = createAction('history/capture');
const Undo = createAction('history/undo');
const Redo = createAction('history/redo');

export const HistoryActions = {
  Clear,
  Capture,
  Undo,
  Redo,
};
