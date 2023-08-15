import { QueueText } from 'model/property/text';
import { BaseQueueEffect } from './base';
import { OBJECT_EFFECT_TYPE } from './meta';

export interface TextEffect extends BaseQueueEffect<QueueText> {
  type: typeof OBJECT_EFFECT_TYPE.TEXT;
}
