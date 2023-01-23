import { QueueCircle } from './object/circle';
import { QueueSquare } from './object/rect';

export type QueueObjectType = QueueSquare | QueueCircle;

export interface QueueDocumentRect {
  width: number;
  height: number;
}

export interface QueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  objects: QueueObjectType[];
}
