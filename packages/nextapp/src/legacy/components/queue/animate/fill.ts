import { hexToRgb, rgbToFullFormHex } from '@legacy/components/queue/color/convertHex';
import { FillEffect, OBJECT_EFFECT_TYPE, QueueEffectType } from '@legacy/model/effect';
import { QueueObjectType } from '@legacy/model/object';
import { QueueFill, WithFill } from '@legacy/model/property';

export interface FillAnimation {
  fromFill: QueueFill;
  fillEffect: FillEffect;
}

export const getCurrentFill = (
  object: QueueObjectType & WithFill,
  effects: QueueEffectType[],
  index: number,
) => {
  return effects
    .filter((effect) => effect.index <= index)
    .filter(
      (effect): effect is FillEffect => effect.type === OBJECT_EFFECT_TYPE.FILL,
    )
    .reduce<QueueFill>((_, effect) => effect.prop, object.fill);
};

export const getFillAnimation = (
  object: QueueObjectType & WithFill,
  effects: QueueEffectType[],
  index: number,
  position: 'forward' | 'backward' | 'pause',
): FillAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromFill = getCurrentFill(
    object,
    effects,
    position === 'forward' ? index - 1 : index + 1,
  );

  const fillEffect = effects.find((effect): effect is FillEffect => {
    const targetIndex = position === 'forward' ? index : index + 1;
    return (
      effect.index === targetIndex && effect.type === OBJECT_EFFECT_TYPE.FILL
    );
  });

  if (!fillEffect) {
    return null;
  }

  const slicedEffect: FillEffect =
    position === 'backward'
      ? {
          ...fillEffect,
          prop: {
            ...getCurrentFill(object, effects, index),
          },
        }
      : fillEffect;

  return {
    fromFill: fromFill,
    fillEffect: slicedEffect,
  };
};

export const getAnimatableFill = (
  progress: number,
  targetFill: QueueFill,
  fromFill?: QueueFill,
): QueueFill => {
  if (progress < 0 || !fromFill) {
    return {
      ...targetFill,
      opacity: Math.max(targetFill.opacity, 0.1),
    };
  }

  const [fromR, fromG, fromB] = hexToRgb(fromFill.color);
  const [targetR, targetG, targetB] = hexToRgb(targetFill.color);

  const r = fromR + Math.round((targetR - fromR) * progress);
  const g = fromG + Math.round((targetG - fromG) * progress);
  const b = fromB + Math.round((targetB - fromB) * progress);

  return {
    color: rgbToFullFormHex(r, g, b),
    opacity: Math.max(
      fromFill.opacity + (targetFill.opacity - fromFill.opacity) * progress,
      0.1,
    ),
  };
};
