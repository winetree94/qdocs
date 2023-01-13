import {
  Dispatch,
  RefObject,
  SetStateAction,
  useLayoutEffect,
  useState,
} from 'react';
import { animate, linear } from '../../../cdk/animation/animate';
import {
  QueueSquareMoveEffect,
  QueueSquareRect,
  QueueSquareWithEffect,
} from '../../../model/object/rect';

export interface RectAnimation {
  fromRect: QueueSquareRect;
  moveEffect: QueueSquareMoveEffect;
}

export const getCurrentRect = (
  object: QueueSquareWithEffect,
  index: number
): QueueSquareRect => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is QueueSquareMoveEffect => effect.type === 'move')
    .reduce<QueueSquareRect>((_, effect) => effect.rect, object.rect);
};

export const getRectAnimation = (
  object: QueueSquareWithEffect,
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

  const moveEffect = object.effects.find(
    (effect): effect is QueueSquareMoveEffect => {
      const targetIndex = position === 'forward' ? index : index + 1;
      return effect.index === targetIndex && effect.type === 'move';
    }
  );

  if (!moveEffect) {
    return null;
  }

  const slicedEffect: QueueSquareMoveEffect =
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
  elementRef: RefObject<HTMLDivElement>,
  object: QueueSquareWithEffect,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): [number, Dispatch<SetStateAction<number>>] => {
  const [rectFrame, setRectFrame] = useState<number>(0);
  const rectAnimation = getRectAnimation(object, index, position);

  useLayoutEffect(() => {
    cancelAnimationFrame(rectFrame);
    if (!rectAnimation) {
      return;
    }
    if (!elementRef.current) {
      return;
    }

    const element = elementRef.current;
    element.style.left = rectAnimation.fromRect.x + 'px';
    element.style.top = rectAnimation.fromRect.y + 'px';
    element.style.width = rectAnimation.fromRect.width + 'px';
    element.style.height = rectAnimation.fromRect.height + 'px';

    const createdFrame = animate({
      duration: rectAnimation.moveEffect.duration,
      timing: linear,
      draw: (progress) => {
        element.style.left =
          rectAnimation.fromRect.x +
          (rectAnimation.moveEffect.rect.x - rectAnimation.fromRect.x) *
            progress +
          'px';
        element.style.top =
          rectAnimation.fromRect.y +
          (rectAnimation.moveEffect.rect.y - rectAnimation.fromRect.y) *
            progress +
          'px';
        element.style.width =
          rectAnimation.fromRect.width +
          (rectAnimation.moveEffect.rect.width - rectAnimation.fromRect.width) *
            progress +
          'px';
        element.style.height =
          rectAnimation.fromRect.width +
          (rectAnimation.moveEffect.rect.height -
            rectAnimation.fromRect.height) *
            progress +
          'px';
      },
    });

    setRectFrame(createdFrame);
    return () => cancelAnimationFrame(rectFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [rectFrame, setRectFrame];
};
