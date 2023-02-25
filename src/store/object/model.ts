import { QueueObjectType } from '../../model/object';

export interface NormalizedQueueObjectType extends Omit<QueueObjectType, 'effects'> {
  pageId: string;
}
