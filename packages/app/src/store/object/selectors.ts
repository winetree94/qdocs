import { createSelector, EntityId } from '@reduxjs/toolkit';
import { QueueObjectType } from '@legacy/model/object';
import { RootState } from '@legacy/store';
import { objectEntityAdapter } from './reducer';

const selectSelf = (state: RootState) => state.objects;
const selectors = objectEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const byId = selectors.selectById;
const entities = selectors.selectEntities;
const ids = selectors.selectIds;
const total = selectors.selectTotal;

const allByPageId = createSelector(
  [all, (_: RootState, id: EntityId) => id],
  (objects, id) => {
    return objects.filter((object) => object.pageId === id);
  },
);

const idSetOfPageId = createSelector([allByPageId], (objects) => {
  return new Set<EntityId>(objects.map(({ id }) => id));
});

const byPageId = createSelector([all], (objects) => {
  return objects.reduce<Record<EntityId, QueueObjectType[]>>((acc, object) => {
    const { pageId } = object;
    if (!acc[pageId]) {
      acc[pageId] = [];
    }
    acc[pageId].push(object);
    return acc;
  }, {});
});

export const ObjectSelectors = {
  all,
  byId,
  entities,
  ids,
  total,
  allByPageId,
  byPageId,
  idSetOfPageId,
};
