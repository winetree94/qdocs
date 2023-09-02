import { EntityId } from '@reduxjs/toolkit';
import { QueueEffectType } from 'model/effect';

export const reduceByObjectId = (effects: QueueEffectType[]) => {
  return effects.reduce<Record<EntityId, QueueEffectType[]>>(
    (result, effect) => {
      if (!result[effect.objectId]) {
        result[effect.objectId] = [];
      }

      result[effect.objectId].push(effect);

      return result;
    },
    {},
  );
};
