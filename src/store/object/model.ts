import { EntityId } from '@reduxjs/toolkit';
import { QueueIcon, QueueImage, QueueObjectType } from 'model/object';

export interface NormalizedQueueObjectType
  extends Omit<QueueObjectType, 'effects'> {
  pageId: EntityId;
}

export interface NormalizedQueueImageObjectType
  extends Omit<QueueImage, 'effects'> {
  pageId: EntityId;
}

export interface NormalizedQueueIconObjectType
  extends Omit<QueueIcon, 'effects'> {
  pageId: EntityId;
}

export const isNormalizedQueueImageObjectType = (
  object: NormalizedQueueObjectType,
): object is NormalizedQueueImageObjectType => {
  return 'image' in object;
};

export const isNormalizedQueueIconObjectType = (
  object: NormalizedQueueObjectType,
): object is NormalizedQueueIconObjectType => {
  return 'iconType' in object;
};
