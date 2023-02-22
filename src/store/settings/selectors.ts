import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { QueueDocumentSettings } from './reducer';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const selectSettings = createSelector(selectSelf, (state) => state);

const selectQueueRange = createSelector(selectSettings, (settings) => {
  const { queueIndex } = settings;
  const ranges: number[] = [];
  const rangeStart = Math.max(queueIndex - 2, 0);
  const rangeEnd = rangeStart + 5;
  for (let i = rangeStart; i < rangeEnd; i++) {
    ranges.push(i);
  }
  return ranges;
});

export const SettingSelectors = {
  selectSettings,
  selectQueueRange,
};
