import { QueueText } from 'model/property/text';
import { BaseQueueEffect } from './base';

export interface TextEffect extends BaseQueueEffect<QueueText> {
  type: 'text';
}
