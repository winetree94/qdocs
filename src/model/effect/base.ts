import { AnimatorTimingFunctionType } from 'cdk/animation/timing';

export interface BaseQueueEffect {
  index: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
}
