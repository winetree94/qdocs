import { createTypedListenerMiddleware } from '@legacy/middleware';
import { PreferencesActions } from '@legacy/store/preferences/actions';

export const preferencesMiddleware = createTypedListenerMiddleware();

/**
 * @description
 * 언어 변경 시 Local Storage 에 저장
 */
preferencesMiddleware.startListening({
  actionCreator: PreferencesActions.changeLanguage,
  effect: (action) => {
    localStorage.setItem('lang', action.payload.language);
  },
});
