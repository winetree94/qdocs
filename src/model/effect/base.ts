import { AnimatorTimingFunctionType } from 'cdk/animation/timing';

export interface BaseQueueEffect<T> {
  uuid: string;
  index: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
  prop: T;
}
