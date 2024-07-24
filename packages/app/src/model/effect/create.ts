import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from '@legacy/model/effect/meta';

export interface CreateEffect extends BaseQueueEffect<void> {
  type: typeof OBJECT_EFFECT_TYPE.CREATE;
}
