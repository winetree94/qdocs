import { atom, selector, selectorFamily } from 'recoil';
import { isExistObjectOnQueue, QueueSquare } from '../model/object/rect';
import { documentSettingsState } from './settings';

export const history: Array<{
  time: number;
  undo: () => void;
}> = [];

export interface QueueDocumentRect {
  width: number;
  height: number;
}

export interface QueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  objects: QueueSquare[];
}

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
  objects: QueueSquare[];
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
      r.forEach((queue) => {
        queue.objects = document!.objects.filter((object) =>
          isExistObjectOnQueue(object, queue.index)
        );
      });
      return r;
    };
  },
});

export const currentQueueObjectsSelector = selector<QueueSquare[]>({
  key: 'currentQueueObjects',
  get: ({ get }) => {
    const document = get(documentState);
    const settings = get(documentSettingsState);
    const result = document!.objects.filter((object) =>
      isExistObjectOnQueue(object, settings.queueIndex)
    );
    return result;
  },
});
