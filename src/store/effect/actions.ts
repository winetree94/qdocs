import { createAction, EntityId } from '@reduxjs/toolkit';
import { NormalizedQueueEffect } from './model';

const addEffect = createAction<NormalizedQueueEffect>('effect/addEffect');

const upsertEffect = createAction<NormalizedQueueEffect>('effect/upsertEffect');

const upsertEffects = createAction<NormalizedQueueEffect[]>('effect/upsertEffects');

const removeMany = createAction<EntityId[]>('effect/removeMany');

export const EffectActions = {
  addEffect,
  upsertEffect,
  upsertEffects,
  removeMany,
};
