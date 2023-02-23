import { AnimatorTimingFunctionType } from 'cdk/animation/timing';

export interface BaseQueueEffect<T> {
  index: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
  prop: T;
}
