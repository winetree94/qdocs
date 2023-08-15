import { QueueFade } from 'model/property/fade';
import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface FadeEffect extends BaseQueueEffect<QueueFade> {
  type: typeof OBJECT_EFFECT_TYPE.FADE;
}
