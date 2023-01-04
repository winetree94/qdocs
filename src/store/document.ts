import { atom, selector, selectorFamily } from 'recoil';
import { generateUUID } from '../cdk/functions/uuid';
import {
  getRectOfIndex,
  QueueRect,
  QueueRectWithEffect,
} from '../model/object/rect';
import { documentSettingsState } from './settings';

export interface QueueDocumentRect {
  width: number;
  height: number;
}

export interface QueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  objects: QueueRectWithEffect[];
}

export const documentState = atom<QueueDocument>({
  key: 'documentState',
  default: {
    documentName: 'Untitled',
    documentRect: {
      width: 1920,
      height: 1080,
    },
    objects: [
      {
        type: 'rect',
        uuid: generateUUID(),
        rect: {
          x: 0,
          y: 0,
          width: 300,
          height: 300,
        },
        effects: [
          {
            type: 'create',
            duration: 0,
            index: 1,
          },
          {
            type: 'move',
            duration: 1000,
            index: 2,
            rect: {
              x: 100,
              y: 100,
              width: 300,
              height: 300,
            },
          },
          {
            type: 'move',
            duration: 1000,
            index: 3,
            rect: {
              x: 200,
              y: 200,
              width: 100,
              height: 100,
            },
          },
          {
            type: 'remove',
            duration: 2000,
            index: 4,
          },
        ],
      },
    ],
  },
});

export interface Queue {
  index: number;
  objects: QueueRect[];
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
        queue.objects = document.objects
          .map((object) => getRectOfIndex(object, queue.index))
          .filter((object) => object !== null) as QueueRect[];
      });
      return r;
    };
  },
});

export const currentQueueObjectsSelector = selector<QueueRect[]>({
  key: 'currentQueueObjects',
  get: ({ get }) => {
    const document = get(documentState);
    const settings = get(documentSettingsState);
    const r = document.objects
      .map((object) => getRectOfIndex(object, settings.queueIndex))
      .filter((object) => object !== null) as QueueRect[];
    return r;
  },
});
