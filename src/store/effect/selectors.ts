import { createSelector, EntityId } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { ObjectSelectors } from 'store/object/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { effectEntityAdapter } from './reducer';
import { QueueEffectType, OBJECT_EFFECT_TYPE } from 'model/effect';
import { QueueObjectType } from 'model/object';
import {
  supportFade,
  supportFill,
  supportRect,
  supportRotation,
  supportScale,
  supportStroke,
  supportText,
} from 'model/support';
import { TimeLineTrack } from 'model/timeline/timeline';

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
  [
    SettingSelectors.pageId,
    SettingSelectors.queueIndex,
    ObjectSelectors.all,
    groupByObjectId,
  ],
  (pageId, queueIndex, objects, effects) => {
    return objects
      .filter((object) => object.pageId === pageId)
      .reduce<QueueObjectType[]>((result, current) => {
        const object = { ...current };
        (effects[current.id] || [])
          .filter(({ index }) => index <= queueIndex)
          .filter(
            (effect) => effect.type !== 'create' && effect.type !== 'remove',
          )
          .forEach((effect) => {
            if (
              effect.type === OBJECT_EFFECT_TYPE.RECT &&
              supportRect(object)
            ) {
              object.rect = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.FADE &&
              supportFade(object)
            ) {
              object.fade = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.FILL &&
              supportFill(object)
            ) {
              object.fill = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.STROKE &&
              supportStroke(object)
            ) {
              object.stroke = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.ROTATE &&
              supportRotation(object)
            ) {
              object.rotate = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.SCALE &&
              supportScale(object)
            ) {
              object.scale = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.TEXT &&
              supportText(object)
            ) {
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
    return objects.reduce<Record<string, QueueObjectType>>((result, object) => {
      result[object.id] = object;
      return result;
    }, {});
  },
);

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

const timelineData = createSelector(
  [ObjectSelectors.all, all, SettingSelectors.pageId],
  (objects, allEffects, pageId) => {
    const objectIds: EntityId[] = [];
    const tracks = objects
      .filter((value) => value.pageId === pageId)
      .reduce((acc, object) => {
        objectIds.push(object.id);
        const effects = allEffects.filter(
          (entity) => entity.objectId === object.id,
        );

        const filtered = effects.map((effect) => effect.index);
        const queueList = effects.reduce((acc, effect) => {
          if (!acc.includes(effect.index)) {
            acc.push(effect.index);
          }
          return acc;
        }, [] as number[]);

        const item: TimeLineTrack = {
          objectId: object.id,
          startQueueIndex: filtered[0],
          endQueueIndex: filtered[filtered.length - 1],
          uniqueColor: object.uniqueColor,
          queueList,
        };

        acc.push(item);
        return acc;
      }, [] as TimeLineTrack[]);

    const timelineData = {
      rowIds: objectIds,
      tracks,
    };

    return timelineData;
  },
);

export const EffectSelectors = {
  all,
  ids,
  byId,
  byIndex,
  entities,
  byIds,
  byObjectId,
  groupByObjectId,
  allByPageId,
  firstQueueByPageId,
  allByPageAndEffectIndex,
  allEffectedObjects,
  allEffectedObjectsMap,
  maxDurationByIndex,
  timelineData,
};
