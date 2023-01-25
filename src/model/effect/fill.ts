import { QueueFill } from 'model/property/fill';
import { BaseQueueEffect } from './base';

export interface FillEffect extends BaseQueueEffect {
  type: 'fill';
  fill: QueueFill;
}
