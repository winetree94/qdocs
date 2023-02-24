import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { QueueObjectType } from 'model/object';

export interface BaseQueueEffect<T> {
  type: keyof Omit<QueueObjectType, 'effects' | 'type' | 'uuid'> | 'create' | 'remove';
  index: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
  prop: T;
}
