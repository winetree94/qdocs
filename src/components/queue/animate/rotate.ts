/* eslint-disable react-hooks/exhaustive-deps */
import { RotateEffect } from 'model/effect';
import { QueueRotate } from 'model/property';
import { NormalizedQueueObjectType } from '../../../store/object/model';
import { NormalizedQueueEffect } from '../../../store/effect';

export interface RotateAnimation {
  fromRotate: QueueRotate;
  rotateEffect: RotateEffect;
}

export const getCurrentRotate = (
  object: NormalizedQueueObjectType,
  effects: NormalizedQueueEffect[],
  index: number,
): QueueRotate => {
  return effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is RotateEffect => effect.type === 'rotate')
    .reduce<QueueRotate>((_, effect) => effect.prop, object.rotate);
};

export const getRotateAnimation = (
  object: NormalizedQueueObjectType,
  effects: NormalizedQueueEffect[],
  index: number,
  position: 'forward' | 'backward' | 'pause',
): RotateAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromRotate = getCurrentRotate(object, effects, position === 'forward' ? index - 1 : index + 1);

  const rotateEffect = effects.find((effect): effect is RotateEffect => {
    const targetIndex = position === 'forward' ? index : index + 1;
    return effect.index === targetIndex && effect.type === 'rotate';
  });

  if (!rotateEffect) {
    return null;
  }

  const slicedEffect: RotateEffect =
    position === 'backward'
      ? {
          ...rotateEffect,
          prop: {
            ...getCurrentRotate(object, effects, index),
          },
        }
      : rotateEffect;

  return {
    fromRotate: fromRotate,
    rotateEffect: slicedEffect,
  };
};

export const getAnimatableRotate = (
  progress: number,
  targetScale: QueueRotate,
  fromScale?: QueueRotate,
): QueueRotate => {
  if (progress < 0 || !fromScale) {
    return targetScale;
  }
  return {
    degree: fromScale.degree + (targetScale.degree - fromScale.degree) * progress,
  };
};
