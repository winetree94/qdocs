import { EntityId } from '@reduxjs/toolkit';
import { QueueObjectType } from './object';

export interface QueueDocumentRect {
  fill: string;
  width: number;
  height: number;
}

export interface QueueDocumentPage {
  id: EntityId;
  pageName: string;
  objects: QueueObjectType[];
}

export interface QueueDocument {
  id: EntityId;
  documentName: string;
  documentRect: QueueDocumentRect;
  pages: QueueDocumentPage[];
}
