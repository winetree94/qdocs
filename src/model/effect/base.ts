import { EntityId } from '@reduxjs/toolkit';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing/meta';
import { OBJECT_EFFECT_TYPES } from './meta';

export interface BaseQueueEffect<T> {
  id: EntityId;
  type: OBJECT_EFFECT_TYPES;
  objectId: EntityId;
  index: number;
  delay: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
  prop: T;
}
