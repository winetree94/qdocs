import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { documentSlice } from 'store/document/reducer';
import { effectMiddleware } from 'store/effect/middlewares';
import { effectSlice } from 'store/effect/reducer';
import { withHistory } from 'store/hooks/history';
import { objectMiddleware } from 'store/object/middlewares';
import { objectsSlice } from 'store/object/reducer';
import { pageMiddleware } from 'store/page/middlewares';
import { pagesSlice } from 'store/page/reducer';
import { settingsMiddleware } from 'store/settings/middlewares';
import { documentSettingsSlice } from 'store/settings/reducer';
import { storageSlice } from 'store/storage/reducer';

const reducers = combineReducers({
  [documentSettingsSlice.name]: withHistory(documentSettingsSlice.reducer),
  [documentSlice.name]: withHistory(documentSlice.reducer),
  [pagesSlice.name]: withHistory(pagesSlice.reducer),
  [objectsSlice.name]: withHistory(objectsSlice.reducer),
  [effectSlice.name]: withHistory(effectSlice.reducer),
  [storageSlice.name]: storageSlice.reducer,
});

export const store = configureStore({
  devTools: true,
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      settingsMiddleware.middleware,
      pageMiddleware.middleware,
      objectMiddleware.middleware,
      effectMiddleware.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
