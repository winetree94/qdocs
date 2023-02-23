import { createTypedListenerMiddleware } from 'middleware';
import { pagesSlice } from 'store/page/reducer';

export const settingsMiddleware = createTypedListenerMiddleware();

settingsMiddleware.startListening({
  actionCreator: pagesSlice.actions.removePage,
  effect: (action, listenerApi) => {
    // listenerApi.dispatch(docsSlice.actions.removePage(action.payload));
  },
});
