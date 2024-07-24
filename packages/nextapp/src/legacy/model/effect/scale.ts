import { QueueScale } from '@legacy/model/property';
import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface ScaleEffect extends BaseQueueEffect<QueueScale> {
  type: typeof OBJECT_EFFECT_TYPE.SCALE;
}
