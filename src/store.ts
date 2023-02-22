import { configureStore } from '@reduxjs/toolkit';
import { docsSlice } from 'store/document/reducer';
import { effectSlice } from 'store/effect/reducer';
import { objectsSlice } from 'store/object/object.reducer';
import { pagesSlice } from 'store/page/reducer';
import { documentSettingsSlice } from 'store/settings/reducer';

export const store = configureStore({
  devTools: true,
  reducer: {
    [documentSettingsSlice.name]: documentSettingsSlice.reducer,
    [docsSlice.name]: docsSlice.reducer,
    [pagesSlice.name]: pagesSlice.reducer,
    [objectsSlice.name]: objectsSlice.reducer,
    [effectSlice.name]: effectSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
