import { createSelector } from '@reduxjs/toolkit';
import {
  CreateEffect,
  FadeEffect,
  FillEffect,
  MoveEffect,
  OBJECT_EFFECT_META,
  RemoveEffect,
  RotateEffect,
  ScaleEffect,
  StrokeEffect,
  TextEffect,
} from 'model/effect';
import { OBJECT_PROPERTY_META } from 'model/meta';
import { RootState } from 'store';
import { ObjectSelectors } from 'store/object/selectors';
import { effectEntityAdapter, NormalizedQueueEffect } from './reducer';

export interface ObjectQueueEffects {
  [OBJECT_EFFECT_META.CREATE]?: Omit<CreateEffect, 'index'>;
  [OBJECT_PROPERTY_META.FADE]?: Omit<FadeEffect, 'index'>;
  [OBJECT_PROPERTY_META.FILL]?: Omit<FillEffect, 'index'>;
  [OBJECT_PROPERTY_META.RECT]?: Omit<MoveEffect, 'index'>;
  [OBJECT_PROPERTY_META.ROTATE]?: Omit<RotateEffect, 'index'>;
  [OBJECT_PROPERTY_META.SCALE]?: Omit<ScaleEffect, 'index'>;
  [OBJECT_PROPERTY_META.STROKE]?: Omit<StrokeEffect, 'index'>;
  [OBJECT_PROPERTY_META.TEXT]?: Omit<TextEffect, 'index'>;
  [OBJECT_EFFECT_META.REMOVE]?: Omit<RemoveEffect, 'index'>;
}

const selectSelf = (state: RootState) => state.effects;
const selectors = effectEntityAdapter.getSelectors(selectSelf);

const all = selectors.selectAll;
const ids = selectors.selectIds;
const byId = selectors.selectById;
const entities = selectors.selectEntities;

const byIds = createSelector([entities, (state: RootState, ids: string[]) => ids], (state, ids) => {
  return ids.map((id) => state[id]);
});

const allByPageId = createSelector([all, ObjectSelectors.idSetOfPageId], (effects, ids) => {
  return effects.filter(({ objectId }) => ids.has(objectId));
});

const allByPageIdEffectIndex = createSelector([allByPageId], (effects) => {
  const map = effects.reduce<NormalizedQueueEffect[][]>((result, effect) => {
    if (!result[effect.index]) {
      result[effect.index] = [];
    }
    result[effect.index].push(effect);
    return result;
  }, []);
  for (let i = 0; i < map.length; i++) {
    if (!map[i]) {
      map[i] = [];
    }
  }
  return map;
});

export const EffectSelectors = {
  all,
  ids,
  byId,
  entities,
  byIds,
  allByPageId,
  allByPageIdEffectIndex,
};
