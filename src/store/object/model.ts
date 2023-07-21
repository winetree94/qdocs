import { EntityId } from '@reduxjs/toolkit';
import { QueueImage, QueueObjectType } from '../../model/object';

export interface NormalizedQueueObjectType extends Omit<QueueObjectType, 'effects'> {
  pageId: EntityId;
}

export interface NormalizedQueueImageObjectType extends Omit<QueueImage, 'effects'> {
  pageId: EntityId;
}
