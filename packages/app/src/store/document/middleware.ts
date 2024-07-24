import { createTypedListenerMiddleware } from '@legacy/middleware';
import { HistoryActions } from '@legacy/store/history';
import { DocumentActions } from './actions';

export const documentMiddleware = createTypedListenerMiddleware();

documentMiddleware.startListening({
  actionCreator: DocumentActions.loadDocument,
  effect: (action, api) => {
    api.dispatch(HistoryActions.Clear());
  },
});
