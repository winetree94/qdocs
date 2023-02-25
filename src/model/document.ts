import { QueueObjectType } from './object';

export interface QueueDocumentRect {
  fill: string;
  width: number;
  height: number;
}

export interface QueueDocumentPage {
  id: string;
  pageName: string;
  objects: QueueObjectType[];
}

export interface QueueDocument {
  id: string;
  documentName: string;
  documentRect: QueueDocumentRect;
  pages: QueueDocumentPage[];
}
