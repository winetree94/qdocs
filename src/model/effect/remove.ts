import { BaseQueueEffect } from './base';

export interface RemoveEffect extends BaseQueueEffect<void> {
  type: 'remove';
}
