import { QueueCircle } from './object/circle';
import { QueueIcon } from './object/icon';
import { QueueSquare } from './object/rect';

export type QueueObjectType = QueueSquare | QueueCircle | QueueIcon;

export interface QueueDocumentRect {
  fill: string;
  width: number;
  height: number;
}

export interface QueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  objects: QueueObjectType[];
}
