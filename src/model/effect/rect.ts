import { QueueRect } from 'model/property/rect';
import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface RectEffect extends BaseQueueEffect<QueueRect> {
  type: typeof OBJECT_EFFECT_TYPE.RECT;
}
