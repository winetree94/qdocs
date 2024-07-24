import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { documentMiddleware } from '@legacy/store/document/middleware';
import { documentSlice } from '@legacy/store/document/reducer';
import { effectMiddleware } from '@legacy/store/effect/middlewares';
import { effectSlice } from '@legacy/store/effect/reducer';
import { historySlice, withHistory } from '@legacy/store/history';
import { objectMiddleware } from '@legacy/store/object/middlewares';
import { objectsSlice } from '@legacy/store/object/reducer';
import { pageMiddleware } from '@legacy/store/page/middlewares';
import { pagesSlice } from '@legacy/store/page/reducer';
import { settingsMiddleware } from '@legacy/store/settings/middlewares';
import { documentSettingsSlice } from '@legacy/store/settings/reducer';
import { preferencesSlice } from '@legacy/store/preferences/reducer';
import { preferencesMiddleware } from '@legacy/store/preferences/middleware';

const reducers = combineReducers({
  [historySlice.name]: historySlice.reducer,
  [documentSettingsSlice.name]: withHistory(documentSettingsSlice.reducer, {
    beforeHistoryApplied: (history, current) => {
      return {
        ...current,
        ...history,
        scale: current.scale,
        autoPlayRepeat: current.autoPlayRepeat,
        queueStart: -1,
      };
    },
  }),
  [documentSlice.name]: withHistory(documentSlice.reducer, {
    beforeHistoryApplied: (history, current) => {
      return {
        ...current,
        ...history,
        documentName: current.documentName,
      };
    },
  }),
  [pagesSlice.name]: withHistory(pagesSlice.reducer),
  [objectsSlice.name]: withHistory(objectsSlice.reducer),
  [effectSlice.name]: withHistory(effectSlice.reducer),
  [preferencesSlice.name]: preferencesSlice.reducer,
});

export const store = configureStore({
  // devTools: false,
  devTools: process.env.NODE_ENV !== 'production',
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      settingsMiddleware.middleware,
      documentMiddleware.middleware,
      pageMiddleware.middleware,
      objectMiddleware.middleware,
      effectMiddleware.middleware,
      preferencesMiddleware.middleware,
    ),
});

/**
 * @description
 * 루트 스토어 모델
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * @description
 * 루트 스토어에서 사용자 데이터가 없는 모델
 * 문서 저장 시 사용되는 모델입니다.
 */
export type DocumentState = Omit<
  RootState,
  'history' | 'preferences' | 'settings'
>;

/**
 * @description
 * Dispatch 를 위한 모델
 */
export type AppDispatch = typeof store.dispatch;
