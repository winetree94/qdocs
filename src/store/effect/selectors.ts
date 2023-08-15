import { createSelector, EntityId } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { ObjectSelectors } from 'store/object/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { effectEntityAdapter } from './reducer';
import { NormalizedQueueObjectType } from '../object/model';
import { QueueEffectType } from 'model/effect';

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
 * Object Id 로 Object 의 Effect 목록을 조회
 * 오브젝트의 이펙트 목록을 조회할 경우 사용
 */
const byObjectId = createSelector(
  [entities, (_: RootState, id: EntityId) => id],
  (state, id) => {
    return Object.values(state).filter(({ objectId }) => objectId === id);
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
 * 전체 이펙트를 object id 로 그룹화하여 Map 형태로 조회
 * 오브젝트의 이펙트 목록을 조회할 경우 사용
 */
const groupByObjectId = createSelector([all], (effects) => {
  return effects.reduce<Record<EntityId, QueueEffectType[]>>(
    (result, effect) => {
      if (!result[effect.objectId]) {
        result[effect.objectId] = [];
      }
      result[effect.objectId].push(effect);
      return result;
    },
    {},
  );
});

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
 * 현재 Page, 현재 Index 의 오브젝트의 상태(크기, 좌표 등)를 조회
 * 에디터에서 현재 위치의 오브젝트들을 화면에 표시하기 위해 사용
 */
const allEffectedObjects = createSelector(
  [SettingSelectors.settings, ObjectSelectors.all, groupByObjectId],
  (settings, objects, effects) => {
    const pageId = settings.pageId;
    return objects
      .filter((object) => object.pageId === pageId)
      .reduce<NormalizedQueueObjectType[]>((result, current) => {
        const object = { ...current };
        (effects[current.id] || [])
          .filter(({ index }) => index <= settings.queueIndex)
          .filter(
            (effect) => effect.type !== 'create' && effect.type !== 'remove',
          )
          .forEach((effect) => {
            if (effect.type === 'rect') {
              object.rect = effect.prop;
            }
            if (effect.type === 'fade') {
              object.fade = effect.prop;
            }
            if (effect.type === 'fill') {
              object.fill = effect.prop;
            }
            if (effect.type === 'stroke') {
              object.stroke = effect.prop;
            }
            if (effect.type === 'rotate') {
              object.rotate = effect.prop;
            }
            if (effect.type === 'scale') {
              object.scale = effect.prop;
            }
            if (effect.type === 'text') {
              object.text = effect.prop;
            }
          });
        result.push(object);
        return result;
      }, []);
  },
);

/**
 * @description
 * allEffectedObjects 를 Map 형태로 변환
 */
const allEffectedObjectsMap = createSelector(
  [allEffectedObjects],
  (objects) => {
    return objects.reduce<Record<string, NormalizedQueueObjectType>>(
      (result, object) => {
        result[object.id] = object;
        return result;
      },
      {},
    );
  },
);

export const EffectSelectors = {
  all,
  ids,
  byId,
  entities,
  byIds,
  byObjectId,
  groupByObjectId,
  allByPageId,
  allByPageAndEffectIndex,
  allEffectedObjects,
  allEffectedObjectsMap,
};
