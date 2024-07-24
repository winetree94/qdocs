import { createTypedListenerMiddleware } from '@legacy/middleware';
import { EffectSelectors } from '@legacy/store/effect/selectors';
import { PageSelectors } from '@legacy/store/page/selectors';
import { SettingsActions } from './actions';
import { SettingSelectors } from './selectors';
import { ObjectActions } from '../object';

export const settingsMiddleware = createTypedListenerMiddleware();

/**
 * @description
 * 제거된 객체의 선택 상태를 해제
 */
settingsMiddleware.startListening({
  actionCreator: ObjectActions.removeMany,
  effect: (action, api) => {
    api.dispatch(SettingsActions.removeSelection([...action.payload]));
  },
});

/**
 * @description
 * play
 */
settingsMiddleware.startListening({
  actionCreator: SettingsActions.forward,
  effect: (action, api) => {
    const state = api.getState();
    const currentPageId = SettingSelectors.pageId(state);
    const currentQueueIndex = SettingSelectors.queueIndex(state);
    const pages = PageSelectors.all(state);
    const byEffects = pages.map((page) =>
      EffectSelectors.allByPageAndEffectIndex(state, page.id),
    );
    const pageIndex = pages.findIndex((page) => page.id === currentPageId);

    let targetPageId = pages[pageIndex].id;
    let targetQueue = currentQueueIndex;
    if (byEffects[pageIndex][currentQueueIndex + 1]) {
      targetQueue = currentQueueIndex + 1;
    } else if (byEffects[pageIndex + 1]) {
      targetPageId = pages[pageIndex + 1].id;
      targetQueue = 0;
    } else if (action.payload?.repeat) {
      targetPageId = pages[0].id;
      targetQueue = 0;
    }

    if (currentPageId === targetPageId && currentQueueIndex === targetQueue) {
      return;
    }

    api.dispatch(
      SettingsActions.updateSettings({
        changes: {
          pageId: targetPageId,
          queueIndex: targetQueue,
          queuePosition: 'forward',
          queueStart: performance.now(),
        },
      }),
    );
  },
});

/**
 * @description
 * rewind
 */
settingsMiddleware.startListening({
  actionCreator: SettingsActions.rewind,
  effect: (_, api) => {
    const state = api.getState();
    const currentPageId = SettingSelectors.pageId(state);
    const currentQueueIndex = SettingSelectors.queueIndex(state);
    const pages = PageSelectors.all(state);
    const byEffects = pages.map((page) =>
      EffectSelectors.allByPageAndEffectIndex(state, page.id),
    );
    const pageIndex = pages.findIndex((page) => page.id === currentPageId);

    let targetPageId = pages[pageIndex].id;
    let targetQueue = currentQueueIndex;
    if (byEffects[pageIndex][currentQueueIndex - 1]) {
      targetQueue = currentQueueIndex - 1;
    } else if (byEffects[pageIndex - 1]) {
      targetPageId = pages[pageIndex - 1].id;
      targetQueue = byEffects[pageIndex - 1].length - 1;
    }

    if (currentPageId === targetPageId && currentQueueIndex === targetQueue) {
      return;
    }

    api.dispatch(
      SettingsActions.updateSettings({
        changes: {
          pageId: targetPageId,
          queueIndex: targetQueue,
          queuePosition: 'backward',
          queueStart: performance.now(),
        },
      }),
    );
  },
});

settingsMiddleware.startListening({
  actionCreator: SettingsActions.goToIn,
  effect: (action, api) => {
    api.dispatch(
      SettingsActions.updateSettings({
        changes: {
          queuePosition: 'pause',
          queueStart: -1,
          queueIndex: 0,
        },
      }),
    );
  },
});

settingsMiddleware.startListening({
  actionCreator: SettingsActions.goToOut,
  effect: (action, api) => {
    const maxEffectIndex = SettingSelectors.currentPageMaxEffectIndex(
      api.getState(),
    );
    api.dispatch(
      SettingsActions.updateSettings({
        changes: {
          queuePosition: 'pause',
          queueStart: -1,
          queueIndex: maxEffectIndex,
        },
      }),
    );
  },
});
