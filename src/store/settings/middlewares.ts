import { createTypedListenerMiddleware } from 'middleware';
import { objectsSlice } from 'store/object/reducer';
import { pagesSlice } from 'store/page/reducer';
import { documentSettingsSlice } from './reducer';

export const settingsMiddleware = createTypedListenerMiddleware();

settingsMiddleware.startListening({
  actionCreator: pagesSlice.actions.removePage,
  effect: (action, listenerApi) => {
    // listenerApi.dispatch(docsSlice.actions.removePage(action.payload));
  },
});

/**
 * @description
 * 제거된 객체의 선택 상태를 해제
 */
settingsMiddleware.startListening({
  actionCreator: objectsSlice.actions.removeMany,
  effect: (action, api) => {
    api.dispatch(documentSettingsSlice.actions.removeSelection([...action.payload]));
  },
});
