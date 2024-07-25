import { HistoryActions } from './actions';

export const HistoryActionTypes = {
  [HistoryActions.Clear.type]: HistoryActions.Clear.type,
  [HistoryActions.Capture.type]: HistoryActions.Capture.type,
  [HistoryActions.Undo.type]: HistoryActions.Undo.type,
  [HistoryActions.Redo.type]: HistoryActions.Redo.type,
};

export interface History {
  time: string;
}

export interface HistoryStoreModel {
  previous: History[];
  future: History[];
}

export interface HistoryOptions<T> {
  /**
   * @description
   * 히스토리가 적용되기 전에 히스토리를 적용할 상태를 변경할 수 있습니다.
   * 히스토리에서 적용할 값을 예외처리할 때 사용됩니다.
   */
  beforeHistoryApplied?: (historyState: T, currentState: T) => T;
}
