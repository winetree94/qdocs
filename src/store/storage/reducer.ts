import { createSlice } from '@reduxjs/toolkit';

export interface QueueStorage {
  로컬스토리지와동기화할값: number;
}

const initialState: QueueStorage = {
  로컬스토리지와동기화할값: 1,
};

export const storageSlice = createSlice({
  name: 'storage',
  initialState: initialState,
  reducers: {},
});
