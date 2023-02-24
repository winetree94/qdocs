import { configureStore } from '@reduxjs/toolkit';
import { documentSlice } from 'store/document/reducer';
import { effectMiddleware } from 'store/effect/middlewares';
import { effectSlice } from 'store/effect/reducer';
import { objectMiddleware } from 'store/object/middlewares';
import { objectsSlice } from 'store/object/reducer';
import { pageMiddleware } from 'store/page/middlewares';
import { pagesSlice } from 'store/page/reducer';
import { settingsMiddleware } from 'store/settings/middlewares';
import { documentSettingsSlice } from 'store/settings/reducer';
import { storageSlice } from 'store/storage/reducer';

export const store = configureStore({
  devTools: true,
  reducer: {
    [documentSettingsSlice.name]: documentSettingsSlice.reducer,
    [documentSlice.name]: documentSlice.reducer,
    [pagesSlice.name]: pagesSlice.reducer,
    [objectsSlice.name]: objectsSlice.reducer,
    [effectSlice.name]: effectSlice.reducer,
    [storageSlice.name]: storageSlice.reducer,
  },
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
