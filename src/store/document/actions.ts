import { createAction } from '@reduxjs/toolkit';
import { QueueDocument } from 'model/document';
import { BaseQueueEffect } from 'model/effect';
import { QueueObjectType } from 'model/object';
import { ObjectQueueEffects, ObjectQueueProps } from './selectors';

export const setDocument = createAction<QueueDocument | null, 'Document/setDocument'>('Document/setDocument');
export const setPages = createAction<QueueDocument['pages']>('Document/setPages');
export const setPageObjects = createAction<{
  page: number;
  objects: QueueObjectType[];
}>('Document/setPageObjects');
export const setPageObjectsByUUID = createAction<{
  page: number;
  objects: { [key: string]: QueueObjectType };
}>('Document/setPageObjectsByUUID');
export const setObjectQueueEffects = createAction<{
  page: number;
  queueIndex: number;
  effects: { [key: string]: ObjectQueueEffects };
}>('Document/setObjectQueueEffects');
export const setObjectDefaultProps = createAction<{
  page: number;
  queueIndex: number;
  props: { [key: string]: ObjectQueueProps };
}>('Document/setObjectQueueProps');
export const setObjectCurrentBasesEffect = createAction<{
  page: number;
  queueIndex: number;
  uuid: string[];
  effects: { [key: string]: BaseQueueEffect };
}>('Document/setObjectCurrentBasesEffect');
