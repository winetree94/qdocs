import { QueueRotate } from '@legacy/model/property/rotation';
import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface RotateEffect extends BaseQueueEffect<QueueRotate> {
  type: typeof OBJECT_EFFECT_TYPE.ROTATE;
}
