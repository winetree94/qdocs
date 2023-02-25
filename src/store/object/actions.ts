import { createAction, EntityId } from '@reduxjs/toolkit';
import { NormalizedQueueObjectType } from './model';

const addOne = createAction<{
  queueIndex?: number;
  object: NormalizedQueueObjectType;
}>('objects/addOne');

const addMany = createAction<{
  queueIndex?: number;
  objects: NormalizedQueueObjectType[];
}>('objects/addMany');

const updateObject = createAction<{
  id: EntityId;
  changes: Partial<NormalizedQueueObjectType>;
}>('objects/updateObject');

const updateObjects = createAction<
  {
    id: EntityId;
    changes: Partial<NormalizedQueueObjectType>;
  }[]
>('objects/updateObjects');

const removeMany = createAction<EntityId[]>('objects/removeMany');

export const ObjectActions = {
  addOne,
  addMany,
  updateObject,
  updateObjects,
  removeMany,
};
