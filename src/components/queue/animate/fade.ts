/* eslint-disable react-hooks/exhaustive-deps */
import { FadeEffect } from 'model/effect';
import { QueueObjectType } from 'model/object';
import { QueueFade } from 'model/property';

export interface FadeAnimation {
  fromFade: QueueFade;
  fadeEffect: FadeEffect;
}

export const getCurrentFade = (
  object: QueueObjectType,
  index: number
): QueueFade => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is FadeEffect => effect.type === 'fade')
    .reduce<QueueFade>((_, effect) => effect.fade, object.fade);
};

export const getFadeAnimation = (
  object: QueueObjectType,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): FadeAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromFade = getCurrentFade(
    object,
    position === 'forward' ? index - 1 : index + 1
  );

  const fadeEffect = object.effects.find((effect): effect is FadeEffect => {
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
          fade: {
            ...getCurrentFade(object, index),
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
  fromFade?: QueueFade
): QueueFade => {
  if (progress < 0 || !fromFade) {
    return {
      opacity: Math.max(targetFade.opacity, 0.1),
    };
  }
  return {
    opacity: Math.max(
      fromFade.opacity + (targetFade.opacity - fromFade.opacity) * progress,
      0.1
    ),
  };
};
