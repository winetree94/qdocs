import { atom, selector, selectorFamily } from 'recoil';
import { generateUUID } from '../cdk/functions/uuid';
import {
  isExistObjectOnQueue,
  QueueSquare,
  QueueSquareWithEffect,
} from '../model/object/rect';
import { documentSettingsState } from './settings';

export interface QueueDocumentRect {
  width: number;
  height: number;
}

export interface QueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  objects: QueueSquareWithEffect[];
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
        stroke: {
          width: 1,
          color: '#000000',
          dashArray: 'solid',
        },
        fill: {
          color: '#ffffff',
        },
        fade: {
          opacity: 0,
        },
        text: {
          text: 'Hello World',
          fontSize: 24,
          fontColor: '#000000',
          fontFamily: 'Arial',
          horizontalAlign: 'center',
          verticalAlign: 'middle',
        },
        effects: [
          {
            type: 'create',
            duration: 0,
            index: 0,
          },
          {
            type: 'fade',
            duration: 500,
            index: 1,
            fade: {
              opacity: 1,
            },
          },
          {
            type: 'move',
            duration: 500,
            index: 1,
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
            index: 2,
            rect: {
              x: 200,
              y: 200,
              width: 100,
              height: 100,
            },
          },
          {
            type: 'fade',
            duration: 1000,
            index: 2,
            fade: {
              opacity: 0.5,
            },
          },
          {
            type: 'move',
            duration: 2000,
            index: 3,
            rect: {
              x: 400,
              y: 400,
              width: 100,
              height: 100,
            },
          },
          {
            type: 'fade',
            duration: 2000,
            index: 3,
            fade: {
              opacity: 0,
            },
          },
          {
            type: 'remove',
            duration: 0,
            index: 7,
          },
        ],
      },
      {
        type: 'rect',
        uuid: generateUUID(),
        rect: {
          x: 500,
          y: 500,
          width: 100,
          height: 100,
        },
        stroke: {
          width: 1,
          color: '#000000',
          dashArray: 'solid',
        },
        fill: {
          color: '#ffffff',
        },
        fade: {
          opacity: 0,
        },
        text: {
          text: 'Hello World',
          fontSize: 24,
          fontColor: '#000000',
          fontFamily: 'Arial',
          horizontalAlign: 'center',
          verticalAlign: 'middle',
        },
        effects: [
          {
            type: 'create',
            duration: 0,
            index: 1,
          },
          {
            type: 'fade',
            duration: 500,
            index: 1,
            fade: {
              opacity: 1,
            },
          },
          {
            type: 'move',
            duration: 1000,
            index: 2,
            rect: {
              x: 1000,
              y: 600,
              width: 300,
              height: 300,
            },
          },
          {
            type: 'fade',
            duration: 500,
            index: 2,
            fade: {
              opacity: 0.5,
            },
          },
          {
            type: 'move',
            duration: 1000,
            index: 3,
            rect: {
              x: 1000,
              y: 100,
              width: 100,
              height: 100,
            },
          },
          {
            type: 'fade',
            duration: 1000,
            index: 3,
            fade: {
              opacity: 0,
            },
          },
          {
            type: 'remove',
            duration: 2000,
            index: 8,
          },
        ],
      },
    ],
  },
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
        queue.objects = document.objects.filter((object) =>
          isExistObjectOnQueue(object, queue.index)
        );
      });
      return r;
    };
  },
});

export const currentQueueObjectsSelector = selector<QueueSquareWithEffect[]>({
  key: 'currentQueueObjects',
  get: ({ get }) => {
    const document = get(documentState);
    const settings = get(documentSettingsState);
    const result = document.objects.filter((object) =>
      isExistObjectOnQueue(object, settings.queueIndex)
    );
    return result;
  },
});

export const selectedObjectIdsState = atom<string[]>({
  key: 'selectedObjectIdsState',
  default: [],
});
