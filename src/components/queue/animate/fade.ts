/* eslint-disable react-hooks/exhaustive-deps */
import { FadeEffect } from 'model/effect';
import { QueueFade } from 'model/property';
import { NormalizedQueueObjectType } from '../../../store/object/model';
import { NormalizedQueueEffect } from '../../../store/effect';

export interface FadeAnimation {
  fromFade: QueueFade;
  fadeEffect: FadeEffect;
}

export const getCurrentFade = (
  object: NormalizedQueueObjectType,
  effects: NormalizedQueueEffect[],
  index: number,
): QueueFade => {
  return effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is FadeEffect => effect.type === 'fade')
    .reduce<QueueFade>((_, effect) => effect.prop, object.fade);
};

export const getFadeAnimation = (
  object: NormalizedQueueObjectType,
  effects: NormalizedQueueEffect[],
  index: number,
  position: 'forward' | 'backward' | 'pause',
): FadeAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromFade = getCurrentFade(object, effects, position === 'forward' ? index - 1 : index + 1);

  const fadeEffect = effects.find((effect): effect is FadeEffect => {
    const targetIndex = position === 'forward' ? index : index + 1;
    return effect.index === targetIndex && effect.type === 'fade';
  });

  if (!fadeEffect) {
    return null;
  }

  const slicedEffect: FadeEffect =
    position === 'backward'
      ? {
          ...fadeEffect,
          prop: {
            ...getCurrentFade(object, effects, index),
          },
        }
      : fadeEffect;

  return {
    fromFade: fromFade,
    fadeEffect: slicedEffect,
  };
};

export const getAnimatableFade = (
  progress: number,
  targetFade: QueueFade,
  fromFade: QueueFade,
  min: number,
): QueueFade => {
  if (progress < 0 || !fromFade) {
    return {
      opacity: Math.max(targetFade.opacity, min),
    };
  }
  return {
    opacity: Math.max(fromFade.opacity + (targetFade.opacity - fromFade.opacity) * progress, min),
  };
};
