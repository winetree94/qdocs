import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { NormalizedQueueObjectType } from 'store/object/reducer';
import { ObjectSelectors } from 'store/object/selectors';
import { PageSelectors } from 'store/page/selectors';
import { SettingSelectors } from 'store/settings/selectors';
import { effectEntityAdapter, NormalizedQueueEffect } from './reducer';

const selectSelf = (state: RootState) => state.effects;
const selectors = effectEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const ids = selectors.selectIds;
const byId = selectors.selectById;
const entities = selectors.selectEntities;

const byIds = createSelector([entities, (_: RootState, ids: string[]) => ids], (state, ids) => {
  return ids.map((id) => state[id]);
});

const byObjectId = createSelector([entities, (_: RootState, id: string) => id], (state, id) => {
  return Object.values(state).filter(({ objectId }) => objectId === id);
});

const allOfObjectId = createSelector([all, (_: RootState, id: string) => id], (effects, id) => {
  return effects.filter(({ objectId }) => objectId === id);
});

const allByPageId = createSelector([all, ObjectSelectors.idSetOfPageId], (effects, ids) => {
  return effects.filter(({ objectId }) => ids.has(objectId));
});

const groupByObjectId = createSelector([all], (effects) => {
  return effects.reduce<Record<string, NormalizedQueueEffect[]>>((result, effect) => {
    if (!result[effect.objectId]) {
      result[effect.objectId] = [];
    }
    result[effect.objectId].push(effect);
    return result;
  }, {});
});

const allByPageAndEffectIndex = createSelector([allByPageId], (effects) => {
  const map = effects.reduce<NormalizedQueueEffect[][]>((result, effect) => {
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
 * @todo
 * 루트부터의 탐색을 피할 수 없는가?
 */
const allEffectedObjects = createSelector(
  [SettingSelectors.settings, PageSelectors.all, ObjectSelectors.all, groupByObjectId],
  (settings, pages, objects, effects) => {
    const pageId = pages[settings.queuePage].uuid;
    return objects
      .filter((object) => object.pageId === pageId)
      .reduce<NormalizedQueueObjectType[]>((result, current) => {
        const object = { ...current };
        effects[current.uuid]
          .filter(({ index }) => index <= settings.queueIndex)
          .filter((effect) => effect.type !== 'create' && effect.type !== 'remove')
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

const allEffectedObjectsMap = createSelector([allEffectedObjects], (objects) => {
  return objects.reduce<Record<string, NormalizedQueueObjectType>>((result, object) => {
    result[object.uuid] = object;
    return result;
  }, {});
});

export const EffectSelectors = {
  all,
  ids,
  byId,
  entities,
  byIds,
  byObjectId,
  groupByObjectId,
  allOfObjectId,
  allByPageId,
  allByPageAndEffectIndex,
  allEffectedObjects,
  allEffectedObjectsMap,
};
