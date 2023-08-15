import { QueueIcon, QueueImage, QueueObjectType } from 'model/object';

export const isNormalizedQueueImageObjectType = (
  object: QueueObjectType,
): object is QueueImage => {
  return 'image' in object;
};

export const isNormalizedQueueIconObjectType = (
  object: QueueObjectType,
): object is QueueIcon => {
  return 'iconType' in object;
};
