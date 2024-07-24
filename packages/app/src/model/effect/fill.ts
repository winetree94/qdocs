import { QueueFill } from '@legacy/model/property/fill';
import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface FillEffect extends BaseQueueEffect<QueueFill> {
  type: typeof OBJECT_EFFECT_TYPE.FILL;
}
