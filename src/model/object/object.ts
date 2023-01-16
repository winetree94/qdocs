export type ObjectType = '';

export interface BaseObject {
  type: string;
  uuid: string;
}

export interface BaseQueueEffect {
  index: number;
  duration: number;
  timing: 'linear';
}

export interface CreateEffect extends BaseQueueEffect {
  type: 'create';
}

export interface RemoveEffect extends BaseQueueEffect {
  type: 'remove';
}
