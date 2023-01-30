import { QueueScale } from 'model/property';
import { BaseQueueEffect } from './base';

export interface ScaleEffect extends BaseQueueEffect {
  type: 'scale';
  scale: QueueScale;
}
