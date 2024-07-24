import { nanoid } from '@reduxjs/toolkit';
import { createTypedListenerMiddleware } from 'middleware';
import { getEffectEntityKey } from './reducer';
import { EffectSelectors } from './selectors';
import { ObjectActions } from '../object';
import { EffectActions } from './actions';
import { SettingSelectors } from '@legacy/store/settings';
import { QueueEffectType } from '@legacy/model/effect';

export const effectMiddleware = createTypedListenerMiddleware();

/**
 * @description
 * 오브젝트가 추가되면, create 이펙트 추가
 */
effectMiddleware.startListening({
  actionCreator: ObjectActions.addOne,
  effect: (action, api) => {
    if (action.payload.queueIndex === undefined) {
      return;
    }
    api.dispatch(
      EffectActions.addEffect({
        id: nanoid(),
        type: 'create',
        duration: 0,
        delay: 0,
        index: action.payload.queueIndex,
        pageId: action.payload.object.pageId,
        objectId: action.payload.object.id,
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
  actionCreator: ObjectActions.addMany,
  effect: (action, api) => {
    if (action.payload.queueIndex === undefined) {
      return;
    }
    api.dispatch(
      EffectActions.upsertEffects(
        action.payload.objects.map((object) => ({
          id: nanoid(),
          type: 'create',
          duration: 0,
          delay: 0,
          index: action.payload.queueIndex,
          pageId: object.pageId,
          objectId: object.id,
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
  actionCreator: ObjectActions.removeMany,
  effect: (action, api) => {
    const state = api.getState();
    const ids = EffectSelectors.all(state)
      .filter((effect) => action.payload.includes(effect.objectId))
      .map((effect) => getEffectEntityKey(effect));
    api.dispatch(EffectActions.removeMany(ids));
  },
});

/**
 * @description
 * 특정 인덱스에서 오브젝트를 제거한 경우 그 이후의 이펙트를 모두 제거하고 delete 이펙트를 삽입
 */
effectMiddleware.startListening({
  actionCreator: EffectActions.removeObjectOnQueue,
  effect: (action, api) => {
    const state = api.getState();
    const currentQueueIndex = SettingSelectors.queueIndex(state);
    const effects = EffectSelectors.all(state).reduce<{
      [key: string]: QueueEffectType[];
    }>((result, effect) => {
      if (!result[effect.objectId]) {
        result[effect.objectId] = [];
      }
      result[effect.objectId].push(effect);
      return result;
    }, {});
    const pendingInsert: QueueEffectType[] = [];
    const pendingRemove: QueueEffectType[] = [];
    action.payload.ids.forEach((id) => {
      const objectEffects = effects[id];
      objectEffects.forEach((effect) => {
        if (effect.index > currentQueueIndex) {
          pendingRemove.push(effect);
        }
      });
      pendingInsert.push({
        id: nanoid(),
        delay: 0,
        duration: 0,
        index: currentQueueIndex,
        pageId: objectEffects[0].pageId,
        objectId: id,
        prop: undefined,
        timing: 'linear',
        type: 'remove',
      });
    });
    api.dispatch(
      EffectActions.removeMany(
        pendingRemove.map((effect) => getEffectEntityKey(effect)),
      ),
    );
    api.dispatch(EffectActions.upsertEffects(pendingInsert));
  },
});
