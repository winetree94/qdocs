import { QueueObjectType } from './object';

export interface QueueDocumentRect {
  fill: string;
  width: number;
  height: number;
}

export interface QueueDocumentPage {
  pageName: string;
  objects: QueueObjectType[];
}

export interface QueueDocument {
  documentName: string;
  documentRect: QueueDocumentRect;
  pages: QueueDocumentPage[];
}
