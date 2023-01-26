import { QueueDocument } from 'model/document';
import { QueueObjectType } from 'model/object';
import { atom, selector, selectorFamily } from 'recoil';
import { isExistObjectOnQueue } from '../model/object/square';
import { documentSettingsState } from './settings';

export const history: Array<{
  time: number;
  undo: () => void;
}> = [];

export const documentState = atom<QueueDocument | null>({
  key: 'documentState',
  default: null,
  effects: [
    ({ onSet, setSelf }): void => {
      console.log(document);
      onSet((newValue, oldValue) => {
        history.push({
          time: Date.now(),
          undo: () => {
            setSelf(oldValue);
          },
        });
        return;
      });
    },
  ],
});

export interface Queue {
  index: number;
  objects: QueueObjectType[];
}

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
        queue.objects = document!.pages[settings.queuePage].objects.filter((object) =>
          isExistObjectOnQueue(object, queue.index)
        );
      });
      return r;
    };
  },
});

export const currentQueueObjectsSelector = selector<QueueObjectType[]>({
  key: 'currentQueueObjects',
  get: ({ get }) => {
    const document = get(documentState);
    const settings = get(documentSettingsState);
    const result = document!.pages[settings.queuePage].objects.filter((object) =>
      isExistObjectOnQueue(object, settings.queueIndex)
    );
    return result;
  },
});
