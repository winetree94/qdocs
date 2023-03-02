/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyAction, createAction, Reducer } from '@reduxjs/toolkit';

export interface WithHistory<T> {
  past: T[];
  present: T;
  future: T[];
}

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

const HistoryActionTypes = {
  [Clear.type]: Clear.type,
  [Capture.type]: Capture.type,
  [Undo.type]: Undo.type,
  [Redo.type]: Redo.type,
};

export interface HistoryOptions<T> {
  isEqual?: (a: T, b: T) => boolean;
}

export const withHistory = <T>(reducer: Reducer<T, AnyAction>, options?: HistoryOptions<T>): Reducer<T, AnyAction> => {
  const previous: T[] = [];
  const future: T[] = [];
  return (state: T, action: AnyAction) => {
    if (!state) {
      return reducer(state, action);
    }

    if (action.type === HistoryActionTypes[Capture.type]) {
      previous.push(state);
      future.splice(0);
      return state;
    }

    if (action.type === HistoryActionTypes[Clear.type]) {
      previous.length = 0;
      future.length = 0;
      return state;
    }

    if (action.type === HistoryActionTypes[Undo.type] && previous.length > 0) {
      future.push(state);
      return previous.pop();
    }

    if (action.type === HistoryActionTypes[Redo.type] && future.length > 0) {
      previous.push(state);
      return future.pop();
    }

    return reducer(state, action);
  };
};
