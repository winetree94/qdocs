import { EntityId } from '@reduxjs/toolkit';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing/meta';

export interface BaseQueueEffect<T> {
  id: EntityId;
  type: string;
  objectId: EntityId;
  index: number;
  delay: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
  prop: T;
}
