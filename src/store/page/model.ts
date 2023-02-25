import { EntityId } from '@reduxjs/toolkit';
import { QueueDocumentPage } from '../../model/document';

export interface NormalizedQueueDocumentPage extends Omit<QueueDocumentPage, 'objects'> {
  index: number;
  documentId: EntityId;
}
