import { createTypedListenerMiddleware } from 'middleware';
import { HistoryActions } from 'store/history';
import { DocumentActions } from './actions';

export const documentMiddleware = createTypedListenerMiddleware();

documentMiddleware.startListening({
  actionCreator: DocumentActions.loadDocument,
  effect: (action, api) => {
    api.dispatch(HistoryActions.Clear());
  },
});
