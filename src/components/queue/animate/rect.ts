/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from 'react';
import { animate, linear } from '../../../cdk/animation/animate';
import {
  MoveEffect,
  QueueSquareRect,
  QueueSquare,
} from '../../../model/object/rect';

export interface RectAnimation {
  fromRect: QueueSquareRect;
  moveEffect: MoveEffect;
}

export const getCurrentRect = (
  object: QueueSquare,
  index: number
): QueueSquareRect => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is MoveEffect => effect.type === 'move')
    .reduce<QueueSquareRect>((_, effect) => effect.rect, object.rect);
};

export const getRectAnimation = (
  object: QueueSquare,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): RectAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromRect = getCurrentRect(
    object,
    position === 'forward' ? index - 1 : index + 1
  );

  const moveEffect = object.effects.find((effect): effect is MoveEffect => {
    const targetIndex = position === 'forward' ? index : index + 1;
    return effect.index === targetIndex && effect.type === 'move';
  });

  if (!moveEffect) {
    return null;
  }

  const slicedEffect: MoveEffect =
    position === 'backward'
      ? {
          ...moveEffect,
          rect: {
            ...getCurrentRect(object, index),
          },
        }
      : moveEffect;

  return {
    fromRect: fromRect,
    moveEffect: slicedEffect,
  };
};

export const WithRectAnimation = (
  object: QueueSquare,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): QueueSquareRect => {
  const [rectFrame, setRectFrame] = useState<number>(0);
  const currentRect = getCurrentRect(object, index);
  const [animatedFrame, setAnimatedFrame] =
    useState<QueueSquareRect>(currentRect);
  const rectAnimation = getRectAnimation(object, index, position);

  useLayoutEffect(() => {
    cancelAnimationFrame(rectFrame);
    if (!rectAnimation) {
      return;
    }
    setAnimatedFrame(rectAnimation.fromRect);
    const createdFrame = animate({
      duration: rectAnimation.moveEffect.duration,
      timing: linear,
      draw: (progress) => {
        setAnimatedFrame({
          x:
            rectAnimation.fromRect.x +
            (rectAnimation.moveEffect.rect.x - rectAnimation.fromRect.x) *
              progress,
          y:
            rectAnimation.fromRect.y +
            (rectAnimation.moveEffect.rect.y - rectAnimation.fromRect.y) *
              progress,
          width:
            rectAnimation.fromRect.width +
            (rectAnimation.moveEffect.rect.width -
              rectAnimation.fromRect.width) *
              progress,
          height:
            rectAnimation.fromRect.width +
            (rectAnimation.moveEffect.rect.height -
              rectAnimation.fromRect.height) *
              progress,
        });
      },
    });

    setRectFrame(createdFrame);
    setAnimatedFrame(rectAnimation.fromRect);
    return () => {
      cancelAnimationFrame(rectFrame);
      setAnimatedFrame(currentRect);
    };
  }, []);

  if (position === 'pause') {
    return currentRect;
  }

  return animatedFrame;
};
