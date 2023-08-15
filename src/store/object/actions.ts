import { createAction, EntityId } from '@reduxjs/toolkit';
import { QueueImage, QueueObjectType } from 'model/object';

const addOne = createAction<{
  queueIndex?: number;
  object: QueueObjectType;
}>('objects/addOne');

const addMany = createAction<{
  queueIndex?: number;
  objects: QueueObjectType[];
}>('objects/addMany');

const updateObject = createAction<{
  id: EntityId;
  changes: Partial<QueueObjectType>;
}>('objects/updateObject');

/**
 * @description reducer에서 수행하는 작업은 동일하기 때문에 objects/updateObject 그대로 사용 <br>
 * 타입 추론이 어렵기 때문에 타입만 새로 만들어서 작업함..
 */
const updateImageObject = createAction<{
  id: EntityId;
  changes: Partial<QueueImage>;
}>('objects/updateObject');

const duplicate = createAction<{
  ids: EntityId[];
}>('objects/duplicate');

const updateObjects = createAction<
  {
    id: EntityId;
    changes: Partial<QueueObjectType>;
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
  updateImageObject,
  updateObjects,
  duplicate,
  removeMany,
  toFront,
  toBack,
  BringForward,
  SendBackward,
};
