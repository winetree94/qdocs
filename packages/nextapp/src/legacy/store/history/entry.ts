import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { HistoryActions } from './actions';
import { HistoryActionTypes, HistoryOptions } from './model';

export const withHistory = <T>(
  reducer: Reducer<T, AnyAction>,
  options?: HistoryOptions<T>,
): Reducer<T, AnyAction> => {
  const previous: T[] = [];
  const future: T[] = [];
  return (state: T, action: AnyAction) => {
    if (!state) {
      return reducer(state, action);
    }

    if (action.type === HistoryActionTypes[HistoryActions.Capture.type]) {
      previous.push(state);
      future.splice(0);
      return state;
    }

    if (action.type === HistoryActionTypes[HistoryActions.Clear.type]) {
      previous.splice(0);
      future.splice(0);
      return state;
    }

    if (
      action.type === HistoryActionTypes[HistoryActions.Undo.type] &&
      previous.length > 0
    ) {
      future.push(state);
      const target = previous.pop();
      return options?.beforeHistoryApplied?.(target, state) || target;
    }

    if (
      action.type === HistoryActionTypes[HistoryActions.Redo.type] &&
      future.length > 0
    ) {
      previous.push(state);
      const target = future.pop();
      return options?.beforeHistoryApplied?.(target, state) || target;
    }

    return reducer(state, action);
  };
};
