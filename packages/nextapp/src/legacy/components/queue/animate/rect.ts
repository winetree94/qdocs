import { RectEffect, QueueEffectType } from '@legacy/model/effect';
import { QueueObjectType } from '@legacy/model/object';
import { QueueRect, WithRect } from '@legacy/model/property';

export interface RectAnimation {
  fromRect: QueueRect;
  moveEffect: RectEffect;
}

/**
 * @description
 * 특정 오브젝트의 특정 큐 인덱스에 해당하는 크기 반환
 */
export const getCurrentRect = (
  object: QueueObjectType & WithRect,
  effects: QueueEffectType[],
  index: number,
): QueueRect => {
  return effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is RectEffect => effect.type === 'rect')
    .reduce<QueueRect>((_, effect) => effect.prop, object.rect);
};

export const getRectAnimation = (
  object: QueueObjectType & WithRect,
  effects: QueueEffectType[],
  index: number,
  position: 'forward' | 'backward' | 'pause',
): RectAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromRect = getCurrentRect(
    object,
    effects,
    position === 'forward' ? index - 1 : index + 1,
  );

  const moveEffect = effects.find((effect): effect is RectEffect => {
    const targetIndex = position === 'forward' ? index : index + 1;
    return effect.index === targetIndex && effect.type === 'rect';
  });

  if (!moveEffect) {
    return null;
  }

  const slicedEffect: RectEffect =
    position === 'backward'
      ? {
          ...moveEffect,
          prop: {
            ...getCurrentRect(object, effects, index),
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
    height: fromRect.height + (targetRect.height - fromRect.height) * progress,
  };
};
