import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { QueueObjectType } from 'model/object';

export interface BaseQueueEffect<T> {
  id: string;
  type: keyof Omit<QueueObjectType, 'effects' | 'type' | 'id'> | 'create' | 'remove';
  objectId: string;
  index: number;
  delay: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
  prop: T;
}
