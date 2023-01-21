import { atom, selector, selectorFamily } from 'recoil';
import { generateUUID } from '../cdk/functions/uuid';
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
          width: 50,
          color: '#000000',
          dasharray: 'solid',
        },
        scale: {
          scale: 1,
        },
        rotate: {
          x: 0,
          y: 0,
          position: 'forward',
          degree: 0,
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
            timing: 'linear',
            duration: 0,
            index: 0,
          },
          {
            type: 'fade',
            duration: 500,
            timing: 'linear',
            index: 1,
            fade: {
              opacity: 1,
            },
          },
          {
            type: 'scale',
            duration: 500,
            timing: 'linear',
            index: 1,
            scale: {
              scale: 2,
            }
          },
          {
            type: 'move',
            duration: 500,
            timing: 'ease-out',
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
            timing: 'linear',
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
            timing: 'linear',
            index: 2,
            fade: {
              opacity: 0.5,
            },
          },
          {
            type: 'move',
            duration: 2000,
            timing: 'linear',
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
            timing: 'linear',
            index: 3,
            fade: {
              opacity: 0,
            },
          },
          {
            type: 'remove',
            timing: 'linear',
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
          dasharray: 'solid',
        },
        fill: {
          color: '#ffffff',
        },
        scale: {
          scale: 1,
        },
        rotate: {
          x: 0,
          y: 0,
          position: 'forward',
          degree: 0,
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
            timing: 'linear',
            duration: 0,
            index: 1,
          },
          {
            type: 'fade',
            timing: 'linear',
            duration: 500,
            index: 1,
            fade: {
              opacity: 1,
            },
          },
          {
            type: 'move',
            timing: 'linear',
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
            timing: 'linear',
            duration: 500,
            index: 2,
            fade: {
              opacity: 0.5,
            },
          },
          {
            type: 'move',
            timing: 'linear',
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
            timing: 'linear',
            duration: 1000,
            index: 3,
            fade: {
              opacity: 0,
            },
          },
          {
            type: 'remove',
            timing: 'linear',
            duration: 2000,
            index: 8,
          },
        ],
      },
    ],
  },
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
        queue.objects = document.objects.filter((object) =>
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
    const result = document.objects.filter((object) =>
      isExistObjectOnQueue(object, settings.queueIndex)
    );
    return result;
  },
});
