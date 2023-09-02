import { RootState } from 'store';

/**
 * state는 store.getState()로 가져온 값
 */
export const serializeDocument = (state: RootState) => {
  if (!state.document) {
    return null;
  }

  const newState = { ...state };
  delete newState.history;
  delete newState.perferences;
  delete newState.settings;

  return newState;
};
