import { AnimatorTimingFunctionType } from 'cdk/animation/timing';

export interface BaseQueueEffect {
  uuid: string;
  index: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
}
