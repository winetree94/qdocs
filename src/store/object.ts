import { isExistObjectOnQueue, QueueObjectType } from 'model/object';
import { DefaultValue, selectorFamily } from 'recoil';
import { queueDocumentPageObjects } from './page';

/**
 * @description
 * 특정 큐에 존재하는 오브젝트들을 관리하는 셀렉터
 *
 * @readonly
 */
export const queueObjects = selectorFamily<
  QueueObjectType[],
  {
    pageIndex: number;
    queueIndex: number;
  }
>({
  key: 'currentQueueObject',
  get: (field) => ({ get }): QueueObjectType[] => {
    const objects = get(queueDocumentPageObjects(field.pageIndex));
    return objects.filter((object) => isExistObjectOnQueue(object, field.queueIndex));
  },
});

/**
 * @description
 * 문서 페이지별 오브젝트들을 uuid 를 키로 가지는 객체로 관리하는 셀렉터
 */
export const objectsByUUID = selectorFamily<
  { [key: string]: QueueObjectType; },
  number
>({
  key: 'objectsByUUID',
  get: (pageIndex) => ({ get }): { [key: string]: QueueObjectType } => {
    const objects = get(queueDocumentPageObjects(pageIndex));
    const result: { [key: string]: QueueObjectType } = {};
    objects.forEach((object) => {
      result[object.uuid] = object;
    });
    return result;
  },
  set: (pageIndex) => ({ set }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(queueDocumentPageObjects(pageIndex), Object.values(newValue));
  },
});

/**
 * @description
 * pageIndex 와 uuid 로 오브젝트를 관리하는 셀렉터
 */
export const objectByUUID = selectorFamily<
  QueueObjectType,
  {
    pageIndex: number;
    uuid: string;
  }
>({
  key: 'objectByUUID',
  get: (field) => ({ get }): QueueObjectType => {
    const objects = get(objectsByUUID(field.pageIndex));
    return objects[field.uuid];
  },
  set: (field) => ({ set, get }, newValue): void => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const selector = objectsByUUID(field.pageIndex);
    set(selector, {
      ...get(selector),
      [field.uuid]: newValue,
    });
  }
});
