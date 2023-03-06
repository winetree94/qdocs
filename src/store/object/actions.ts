import { createAction, EntityId } from '@reduxjs/toolkit';
import { NormalizedQueueObjectType } from './model';

const addOne = createAction<{
  queueIndex?: number;
  object: Omit<NormalizedQueueObjectType, 'index'>;
}>('objects/addOne');

const addMany = createAction<{
  queueIndex?: number;
  objects: Omit<NormalizedQueueObjectType, 'index'>[];
}>('objects/addMany');

const updateObject = createAction<{
  id: EntityId;
  changes: Partial<Omit<NormalizedQueueObjectType, 'index'>>;
}>('objects/updateObject');

const duplicate = createAction<{
  ids: EntityId[];
}>('objects/duplicate');

const updateObjects = createAction<
  {
    id: EntityId;
    changes: Partial<Omit<NormalizedQueueObjectType, 'index'>>;
  }[]
>('objects/updateObjects');

/**
 * @description
 * 맨 앞으로 가져오기
 */
const toFront = createAction<{
  id: EntityId;
}>('objects/toFront');

/**
 * @description
 * 맨 뒤로 보내기
 */
const toBack = createAction<{
  id: EntityId;
}>('objects/toBack');

/**
 * @description
 * 앞으로 가져오기
 */
const BringForward = createAction<{
  id: EntityId;
}>('objects/BringForward');

/**
 * @description
 * 뒤로 보내기
 */
const SendBackward = createAction<{
  id: EntityId;
}>('objects/SendBackward');

/**
 * @description
 * 오브젝트 다수 제거
 */
const removeMany = createAction<EntityId[]>('objects/removeMany');

export const ObjectActions = {
  addOne,
  addMany,
  updateObject,
  updateObjects,
  duplicate,
  removeMany,
  toFront,
  toBack,
  BringForward,
  SendBackward,
};
