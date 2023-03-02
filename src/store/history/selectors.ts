import { RootState } from 'store';

const selectSelf = (state: RootState) => state.history;

const all = (state: RootState) => selectSelf(state);

export const HistorySelectors = {
  all,
};
