import { BaseQueueEffect } from './base';

export interface RemoveEffect extends BaseQueueEffect {
  type: 'remove';
}
