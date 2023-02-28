import { combineReducers, configureStore } from '@reduxjs/toolkit';
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
import * as ReduxUndo from 'redux-undo';
const undoable = ReduxUndo.default;
console.log(undoable);

const reducers = combineReducers({
  [documentSettingsSlice.name]: documentSettingsSlice.reducer,
  [documentSlice.name]: undoable(documentSlice.reducer),
  [pagesSlice.name]: undoable(pagesSlice.reducer),
  [objectsSlice.name]: undoable(objectsSlice.reducer),
  [effectSlice.name]: undoable(effectSlice.reducer),
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
