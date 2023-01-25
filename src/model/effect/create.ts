import { BaseQueueEffect } from './base';

export interface CreateEffect extends BaseQueueEffect {
  type: 'create';
}
