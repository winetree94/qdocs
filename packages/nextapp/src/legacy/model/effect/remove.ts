import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface RemoveEffect extends BaseQueueEffect<void> {
  type: typeof OBJECT_EFFECT_TYPE.REMOVE;
}
