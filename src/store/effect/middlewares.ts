import { nanoid } from '@reduxjs/toolkit';
import { createTypedListenerMiddleware } from 'middleware';
import { getEffectEntityKey } from './reducer';
import { EffectSelectors } from './selectors';
import { ObjectActions } from '../object';
import { EffectActions } from './actions';
import { SettingSelectors } from 'store/settings';
import { NormalizedQueueEffect } from './model';

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

effectMiddleware.startListening({
  actionCreator: EffectActions.removeObjectOnQueue,
  effect: (action, api) => {
    const state = api.getState();
    const settings = SettingSelectors.settings(state);
    const effects = EffectSelectors.all(state).reduce<{ [key: string]: NormalizedQueueEffect[] }>((result, effect) => {
      if (!result[effect.objectId]) {
        result[effect.objectId] = [];
      }
      result[effect.objectId].push(effect);
      return result;
    }, {});
    const pendingInsert: NormalizedQueueEffect[] = [];
    const pendingRemove: NormalizedQueueEffect[] = [];
    action.payload.ids.map((id) => {
      const objectEffects = effects[id];
      objectEffects.forEach((effect) => {
        if (effect.index > settings.queueIndex) {
          pendingRemove.push(effect);
        }
      });
      pendingInsert.push({
        id: nanoid(),
        delay: 0,
        duration: 0,
        index: settings.queueIndex,
        objectId: id,
        prop: undefined,
        timing: 'linear',
        type: 'remove',
      });
    });
    api.dispatch(EffectActions.removeMany(pendingRemove.map((effect) => getEffectEntityKey(effect))));
    api.dispatch(EffectActions.upsertEffects(pendingInsert));
  },
});
