import { isExistObjectOnQueue, QueueObjectType } from 'model/object';
import { DefaultValue, selectorFamily } from 'recoil';
import { documentState } from './document';
import { documentPageObjects } from './page';
import { documentSettingsState } from './settings';

/**
 * @description
 * 특정 큐에 존재하는 오브젝트들을 관리하는 셀렉터
 *
 * @readonly
 */
export const currentQueueObjects = selectorFamily<
  QueueObjectType[],
  {
    pageIndex: number;
    queueIndex: number;
  }
>({
  key: 'currentQueueObject',
  get: (field) => ({ get }): QueueObjectType[] => {
    const objects = get(documentPageObjects(field.pageIndex));
    return objects.filter((object) => isExistObjectOnQueue(object, field.queueIndex));
  },
});

/**
 * @description
 * 특정 큐에 존재하는 오브젝트들의 UUID를 관리하는 셀렉터
 *
 * @readonly
 */
export const currentQueueObjectUUIDs = selectorFamily<
  string[],
  {
    pageIndex: number;
    queueIndex: number;
  }
>({
  key: 'currentQueueObjectUUIDs',
  get: (field) => ({ get }): string[] => {
    const objects = get(currentQueueObjects(field));
    return objects.map((object) => object.uuid);
  }
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
    const objects = get(documentPageObjects(pageIndex));
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
    set(documentPageObjects(pageIndex), Object.values(newValue));
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

export interface Queue {
  index: number;
  objects: QueueObjectType[];
}

/**
 * @description
 * @deprecated
 */
export const queueObjectsByQueueIndexSelector = selectorFamily<
  Queue[],
  { start: number; end: number }
>({
  key: 'documentObjectByQueueIndex',
  get: (field) => {
    return ({ get }): Queue[] => {
      const r: Queue[] = [];
      for (let i = Math.max(field.start, 0); i <= field.end; i++) {
        r.push({
          index: i,
          objects: [],
        });
      }
      const document = get(documentState);
      const settings = get(documentSettingsState);
      r.forEach((queue) => {
        queue.objects = document!.pages[settings.queuePage].objects.filter(
          (object) => isExistObjectOnQueue(object, queue.index)
        );
      });
      return r;
    };
  },
});