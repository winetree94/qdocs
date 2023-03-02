import { createSlice } from '@reduxjs/toolkit';
import { HistoryActions } from './actions';
import { HistoryStoreModel } from './model';

/**
 * @description
 * 이 스토어는 히스토리의 존재 유무를 판단할 수 있게 하기위한 기능으로,
 * 실제 히스토리의 반영은 entry 에서 동작한다.
 */
export const historySlice = createSlice({
  name: 'history',
  initialState: {
    previous: [],
    future: [],
  } as HistoryStoreModel,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(HistoryActions.Capture, (state) => {
      state.previous.push({
        time: new Date().toISOString(),
      });
      state.future.splice(0);
    });

    builder.addCase(HistoryActions.Clear, (state) => {
      state.previous.splice(0);
      state.future.splice(0);
    });

    builder.addCase(HistoryActions.Undo, (state) => {
      if (state.previous.length > 0) {
        state.future.push(state.previous.pop());
      }
    });

    builder.addCase(HistoryActions.Redo, (state) => {
      if (state.future.length > 0) {
        state.previous.push(state.future.pop());
      }
    });
    return;
  },
});
