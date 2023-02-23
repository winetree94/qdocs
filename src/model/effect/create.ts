import { BaseQueueEffect } from './base';

export interface CreateEffect extends BaseQueueEffect<void> {
  type: 'create';
}
