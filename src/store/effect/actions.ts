import { createAction, EntityId } from '@reduxjs/toolkit';
import { QueueEffectType } from 'model/effect';

const addEffect = createAction<QueueEffectType>('effect/addEffect');

const upsertEffect = createAction<QueueEffectType>('effect/upsertEffect');

const upsertEffects = createAction<QueueEffectType[]>('effect/upsertEffects');

const removeMany = createAction<EntityId[]>('effect/removeMany');

const removeObjectOnQueue = createAction<{ ids: EntityId[] }>(
  'effect/removeObjectOnQueue',
);

export const EffectActions = {
  addEffect,
  upsertEffect,
  upsertEffects,
  removeMany,
  removeObjectOnQueue,
};
