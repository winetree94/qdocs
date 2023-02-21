import { configureStore } from '@reduxjs/toolkit';
import { documentReducer } from 'store/document/reducer';
import { settingsReducer } from 'store/settings/reducer';

export const store = configureStore({
  devTools: true,
  reducer: {
    document: documentReducer,
    settings: settingsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
