import { atom } from 'recoil';
import { generateUUID } from '../cdk/functions/uuid';
import { QueueRectObject } from '../model/object/rect';

export interface QueueDocumentRect {
  width: number;
  height: number;
}

export interface QueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  objects: QueueRectObject[];
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
        effects: [
          {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            fill: '#000000',
            stroke: '#000000',
            strokeWidth: 0,
            strokeDasharray: '',
            duration: 0,
          },
        ],
      },
    ],
  },
});
