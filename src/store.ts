import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { documentMiddleware } from 'store/document/middleware';
import { documentSlice } from 'store/document/reducer';
import { effectMiddleware } from 'store/effect/middlewares';
import { effectSlice } from 'store/effect/reducer';
import { historySlice, withHistory } from 'store/history';
import { objectMiddleware } from 'store/object/middlewares';
import { objectsSlice } from 'store/object/reducer';
import { pageMiddleware } from 'store/page/middlewares';
import { pagesSlice } from 'store/page/reducer';
import { settingsMiddleware } from 'store/settings/middlewares';
import { documentSettingsSlice } from 'store/settings/reducer';
import { storageSlice } from 'store/storage/reducer';

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
  [storageSlice.name]: storageSlice.reducer,
});

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      settingsMiddleware.middleware,
      documentMiddleware.middleware,
      pageMiddleware.middleware,
      objectMiddleware.middleware,
      effectMiddleware.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
