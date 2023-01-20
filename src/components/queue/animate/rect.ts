/* eslint-disable react-hooks/exhaustive-deps */
import {
  MoveEffect,
  QueueRect,
  QueueSquare,
} from '../../../model/object/rect';

export interface RectAnimation {
  fromRect: QueueRect;
  moveEffect: MoveEffect;
}

export const getCurrentRect = (
  object: QueueSquare,
  index: number
): QueueRect => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is MoveEffect => effect.type === 'move')
    .reduce<QueueRect>((_, effect) => effect.rect, object.rect);
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

export const getAnimatableRect = (
  progress: number,
  targetRect: QueueRect,
  fromRect?: QueueRect,
): QueueRect => {
  if (progress < 0 || !fromRect) {
    return targetRect;
  }
  return {
    x: fromRect.x + (targetRect.x - fromRect.x) * progress,
    y: fromRect.y + (targetRect.y - fromRect.y) * progress,
    width: fromRect.width + (targetRect.width - fromRect.width) * progress,
    height: fromRect.width + (targetRect.height - fromRect.height) * progress,
  };
};
