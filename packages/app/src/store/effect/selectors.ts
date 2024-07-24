import { createSelector, EntityId } from '@reduxjs/toolkit';
import { RootState } from '@legacy/store';
import { ObjectSelectors } from '@legacy/store/object/selectors';
import { effectEntityAdapter } from './reducer';
import { QueueEffectType } from '@legacy/model/effect';

const selectSelf = (state: RootState) => state.effects;
const selectors = effectEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const ids = selectors.selectIds;
const byId = selectors.selectById;
const entities = selectors.selectEntities;

/**
 * @description
 * Effect 의 id(복합키) 로 Effect 를 조회
 * 이펙트 id 를 정확히 알고 있는 경우 사용
 */
const byIds = createSelector(
  [entities, (_: RootState, ids: EntityId[]) => ids],
  (state, ids) => {
    return ids.map((id) => state[id]);
  },
);

/**
 * @description
 * 이펙트를 인덱스 별로 그룹화하여 Map 형태로 조회
 */
const byIndex = createSelector([all], (effects) => {
  return effects.reduce<Record<number, QueueEffectType[]>>((result, effect) => {
    if (!result[effect.index]) {
      result[effect.index] = [];
    }
    result[effect.index].push(effect);
    return result;
  }, {});
});

const effectsByObjectId = createSelector([all], (effects) => {
  return effects.reduce<Record<string, QueueEffectType[]>>((result, effect) => {
    if (!result[effect.objectId]) {
      result[effect.objectId] = [];
    }
    result[effect.objectId].push(effect);
    return result;
  }, {});
});

/**
 * @description
 * Object Id 로 Object 의 Effect 목록을 조회
 * 오브젝트의 이펙트 목록을 조회할 경우 사용
 */
const byObjectId = createSelector(
  [all, (_: RootState, id: EntityId) => id],
  (state, id) => {
    return state.filter(({ objectId }) => objectId === id);
  },
);

/**
 * @description
 * Page Id 로 Page 의 Effect 목록을 조회
 * 페이지의 이펙트 목록을 조회할 경우 사용
 */
const allByPageId = createSelector(
  [all, ObjectSelectors.idSetOfPageId],
  (effects, ids) => {
    return effects.filter(({ objectId }) => ids.has(objectId));
  },
);

/**
 * @description
 * 첫번째 큐의 이펙트 목록을 페이지 아이디로 조회
 * 페이지의 첫번째 큐의 이펙트 목록을 조회할 경우 사용
 *
 * createSelector를 사용하여 메모이제이션을 시도
 */
const firstQueueByPageId = createSelector(
  [all, ObjectSelectors.idSetOfPageId],
  (effects, ids) =>
    effects.filter(({ index, objectId }) => index === 0 && ids.has(objectId)),
);

/**
 * @description
 * Page Id 로 Effect Index 로 그룹화된 이펙트 목록을 조회
 * Effect Index 별로 Effect 의 존재 여부를 확인할 때 사용
 */
const allByPageAndEffectIndex = createSelector([allByPageId], (effects) => {
  const map = effects.reduce<QueueEffectType[][]>((result, effect) => {
    if (!result[effect.index]) {
      result[effect.index] = [];
    }
    result[effect.index].push(effect);
    return result;
  }, []);
  for (let i = 0; i < map.length; i++) {
    if (!map[i]) {
      map[i] = [];
    }
  }
  return map;
});

/**
 * @description
 * Queue Index 별로 이펙트 중 가장 긴 duration + delay 를 조회
 */
const maxDurationByIndex = createSelector([byIndex], (effects) => {
  const models = Object.entries(effects).reduce<number[]>(
    (result, [index, effects]) => {
      const maxDuration = effects.reduce((result, effect) => {
        const currentEffectDuration = effect.delay + effect.duration;
        if (currentEffectDuration > result) {
          return currentEffectDuration;
        }
        return result;
      }, 0);
      result[Number(index)] = maxDuration;
      return result;
    },
    [],
  );
  return models;
});

export const EffectSelectors = {
  all,
  ids,
  byId,
  byIndex,
  byIds,
  effectsByObjectId,
  byObjectId,
  allByPageId,
  firstQueueByPageId,
  allByPageAndEffectIndex,
  maxDurationByIndex,
};
