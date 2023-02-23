import { QueueScale } from 'model/property';
import { BaseQueueEffect } from './base';

export interface ScaleEffect extends BaseQueueEffect<QueueScale> {
  type: 'scale';
}
