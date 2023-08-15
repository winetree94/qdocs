import { QueueDocumentRect } from '../../model/document';
import { EntityId } from '@reduxjs/toolkit';

export interface QueueDocument {
  id: EntityId;
  documentName: string;
  documentRect: QueueDocumentRect;
}

export type NormalizedQueueDocument = Omit<QueueDocument, 'pages'>;
