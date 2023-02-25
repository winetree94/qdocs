import { EntityId } from '@reduxjs/toolkit';
import { AnimatorTimingFunctionType } from 'cdk/animation/timing';
import { QueueObjectType } from 'model/object';

export interface BaseQueueEffect<T> {
  id: EntityId;
  type: keyof Omit<QueueObjectType, 'effects' | 'type' | 'id'> | 'create' | 'remove';
  objectId: EntityId;
  index: number;
  delay: number;
  duration: number;
  timing: AnimatorTimingFunctionType;
  prop: T;
}
