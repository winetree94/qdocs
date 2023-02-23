import { QueueObjectType } from './object';

export interface QueueDocumentRect {
  fill: string;
  width: number;
  height: number;
}

export interface QueueDocumentPage {
  uuid: string;
  pageName: string;
  objects: QueueObjectType[];
}

export interface QueueDocument {
  uuid: string;
  documentName: string;
  documentRect: QueueDocumentRect;
  pages: QueueDocumentPage[];
}
