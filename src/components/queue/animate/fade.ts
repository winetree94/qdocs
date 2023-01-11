import { RefObject, useLayoutEffect, useState } from 'react';
import { animate, linear } from '../../../cdk/animation/animate';
import {
  QueueSquareFade,
  QueueSquareFadeEffect,
  QueueSquareWithEffect,
} from '../../../model/object/rect';

export interface FadeAnimation {
  fromFade: QueueSquareFade;
  fadeEffect: QueueSquareFadeEffect;
}

export const getCurrentFade = (
  object: QueueSquareWithEffect,
  index: number
): QueueSquareFade => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is QueueSquareFadeEffect => effect.type === 'fade')
    .reduce<QueueSquareFade>((_, effect) => effect.fade, object.fade);
};

export const getFadeAnimation = (
  object: QueueSquareWithEffect,
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

  const fadeEffect = object.effects.find(
    (effect): effect is QueueSquareFadeEffect => {
      const targetIndex = position === 'forward' ? index : index + 1;
      return effect.index === targetIndex && effect.type === 'fade';
    }
  );

  if (!fadeEffect) {
    return null;
  }

  const slicedEffect: QueueSquareFadeEffect =
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

export const WithFadeAnimation = (
  elementRef: RefObject<HTMLDivElement>,
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [fadeFrame, setFadeFrame] = useState<number>(0);
  const fadeAnimation = getFadeAnimation(object, index, position);

  useLayoutEffect(() => {
    cancelAnimationFrame(fadeFrame);
    if (!fadeAnimation) {
      return;
    }
    if (!elementRef.current) {
      return;
    }

    const element = elementRef.current;
    element.style.opacity = `${fadeAnimation.fromFade.opacity}`;

    const createdFrame = animate({
      duration: fadeAnimation.fadeEffect.duration,
      timing: linear,
      draw: (progress) => {
        element.style.opacity =
          fadeAnimation.fromFade.opacity +
          (fadeAnimation.fadeEffect.fade.opacity -
            fadeAnimation.fromFade.opacity) *
            progress +
          '';
      },
    });

    setFadeFrame(createdFrame);
    return () => cancelAnimationFrame(fadeFrame);
  }, []);

  return [fadeFrame, setFadeFrame];
};
