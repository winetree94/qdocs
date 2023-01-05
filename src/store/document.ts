import { atom, selector, selectorFamily } from 'recoil';
import { generateUUID } from '../cdk/functions/uuid';
import {
  getRectOfIndex,
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
            index: 2,
          },
          {
            type: 'move',
            duration: 1000,
            index: 3,
            rect: {
              x: 1000,
              y: 600,
              width: 300,
              height: 300,
            },
          },
          {
            type: 'move',
            duration: 1000,
            index: 4,
            rect: {
              x: 1000,
              y: 100,
              width: 100,
              height: 100,
            },
          },
          {
            type: 'remove',
            duration: 2000,
            index: 5,
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
        queue.objects = document.objects
          .map((object) => getRectOfIndex(object, queue.index))
          .filter((object) => object !== null) as QueueSquare[];
      });
      return r;
    };
  },
});

export const currentQueueObjectsSelector = selector<
  {
    from: QueueSquare | null;
    to: QueueSquare;
  }[]
>({
  key: 'currentQueueObjects',
  get: ({ get }) => {
    const document = get(documentState);
    const settings = get(documentSettingsState);
    const result = document.objects
      .map((object) => {
        const toObject = getRectOfIndex(object, settings.queueIndex);
        const fromObject =
          settings.queuePosition === 'pause'
            ? null
            : settings.queuePosition === 'forward'
            ? getRectOfIndex(object, settings.queueIndex - 1)
            : getRectOfIndex(object, settings.queueIndex + 1);
        return {
          from: fromObject,
          to: toObject,
        };
      })
      .filter((object) => object.to !== null) as {
      from: QueueSquare | null;
      to: QueueSquare;
    }[];
    console.log(result);
    return result;
  },
});
