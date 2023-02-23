import { createTypedListenerMiddleware } from 'middleware';
import { objectsSlice } from 'store/object/reducer';
import { effectSlice, getEffectEntityKey } from './reducer';
import { EffectSelectors } from './selectors';

export const effectMiddleware = createTypedListenerMiddleware();

/**
 * @description
 * 오브젝트가 추가되면, create 이펙트 추가
 */
effectMiddleware.startListening({
  actionCreator: objectsSlice.actions.addOne,
  effect: (action, api) => {
    if (!action.payload.queueIndex) {
      return;
    }
    api.dispatch(
      effectSlice.actions.upsertEffect({
        type: 'create',
        duration: 0,
        index: action.payload.queueIndex,
        objectId: action.payload.object.uuid,
        prop: undefined,
        timing: 'linear',
      }),
    );
  },
});

/**
 * @description
 * 오브젝트 다수가 추가되면, create 이펙트 추가
 */
effectMiddleware.startListening({
  actionCreator: objectsSlice.actions.addMany,
  effect: (action, api) => {
    if (!action.payload.queueIndex) {
      return;
    }
    api.dispatch(
      effectSlice.actions.upsertEffects(
        action.payload.objects.map((object) => ({
          type: 'create',
          duration: 0,
          index: action.payload.queueIndex,
          objectId: object.uuid,
          prop: undefined,
          timing: 'linear',
        })),
      ),
    );
  },
});

/**
 * @description
 * 오브젝트가 제거되면, 오브젝트에 속하는 이펙트들 제거
 */
effectMiddleware.startListening({
  actionCreator: objectsSlice.actions.removeMany,
  effect: (action, api) => {
    const state = api.getState();
    const uuids = EffectSelectors.all(state)
      .filter((effect) => action.payload.includes(effect.objectId))
      .map((effect) => getEffectEntityKey(effect));
    api.dispatch(effectSlice.actions.removeMany(uuids));
  },
});
