import { QueueStroke } from 'model/property/stroke';
import { BaseQueueEffect } from './base';

export interface StrokeEffect extends BaseQueueEffect {
  type: 'stroke';
  stroke: QueueStroke;
}
