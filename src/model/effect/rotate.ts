import { QueueRotate } from 'model/property/rotation';
import { BaseQueueEffect } from './base';

export interface RotateEffect extends BaseQueueEffect<QueueRotate> {
  type: 'rotate';
}
