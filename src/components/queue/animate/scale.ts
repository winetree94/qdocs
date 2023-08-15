import { ScaleEffect, QueueEffectType } from 'model/effect';
import { QueueScale } from 'model/property';
import { NormalizedQueueObjectType } from '../../../store/object/model';

export interface ScaleAnimation {
  fromScale: QueueScale;
  scaleEffect: ScaleEffect;
}

export const getCurrentScale = (
  object: NormalizedQueueObjectType,
  effects: QueueEffectType[],
  index: number,
): QueueScale => {
  return effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is ScaleEffect => effect.type === 'scale')
    .reduce<QueueScale>((_, effect) => effect.prop, object.scale);
};

export const getScaleAnimation = (
  object: NormalizedQueueObjectType,
  effects: QueueEffectType[],
  index: number,
  position: 'forward' | 'backward' | 'pause',
): ScaleAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromScale = getCurrentScale(
    object,
    effects,
    position === 'forward' ? index - 1 : index + 1,
  );

  const scaleEffect = effects.find((effect): effect is ScaleEffect => {
    const targetIndex = position === 'forward' ? index : index + 1;
    return effect.index === targetIndex && effect.type === 'scale';
  });

  if (!scaleEffect) {
    return null;
  }

  const slicedEffect: ScaleEffect =
    position === 'backward'
      ? {
          ...scaleEffect,
          prop: {
            ...getCurrentScale(object, effects, index),
          },
        }
      : scaleEffect;

  return {
    fromScale: fromScale,
    scaleEffect: slicedEffect,
  };
};

export const getAnimatableScale = (
  progress: number,
  targetScale: QueueScale,
  fromScale?: QueueScale,
): QueueScale => {
  if (progress < 0 || !fromScale) {
    return targetScale;
  }
  return {
    scale: fromScale.scale + (targetScale.scale - fromScale.scale) * progress,
  };
};
