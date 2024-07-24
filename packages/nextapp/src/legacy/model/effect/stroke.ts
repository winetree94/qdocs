import { QueueStroke } from '@legacy/model/property/stroke';
import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface StrokeEffect extends BaseQueueEffect<QueueStroke> {
  type: typeof OBJECT_EFFECT_TYPE.STROKE;
}
