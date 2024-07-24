import {
  FadeEffect,
  FillEffect,
  OBJECT_EFFECT_TYPE,
  OBJECT_EFFECT_TYPES,
  QueueEffectType,
  RectEffect,
  RemoveEffect,
  RotateEffect,
  ScaleEffect,
  StrokeEffect,
  TextEffect,
} from '@legacy/model/effect';
import { OBJECT_TYPE, OBJECT_TYPES, QueueObjectType } from '@legacy/model/object';
import { CreateEffect } from '../effect/create';

export const EFFECT_SUPPORTED_MAP: {
  [key in OBJECT_EFFECT_TYPES]: {
    [key in OBJECT_TYPES]: boolean;
  };
} = {
  [OBJECT_EFFECT_TYPE.CREATE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_EFFECT_TYPE.REMOVE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_EFFECT_TYPE.FADE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_EFFECT_TYPE.FILL]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: false,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: false,
  },
  [OBJECT_EFFECT_TYPE.RECT]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_EFFECT_TYPE.ROTATE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_EFFECT_TYPE.SCALE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
  [OBJECT_EFFECT_TYPE.STROKE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: false,
  },
  [OBJECT_EFFECT_TYPE.TEXT]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
    [OBJECT_TYPE.GROUP]: true,
  },
} as const;

export const OBJECT_SUPPORTED_EFFECTS = Object.values(OBJECT_TYPE).reduce<{
  [key in OBJECT_TYPES]: OBJECT_EFFECT_TYPES[];
}>(
  (acc, objectType) => {
    acc[objectType] = Object.values(OBJECT_EFFECT_TYPE).filter(
      (effectType) => EFFECT_SUPPORTED_MAP[effectType][objectType],
    );
    return acc;
  },
  {
    [OBJECT_TYPE.CIRCLE]: [],
    [OBJECT_TYPE.ICON]: [],
    [OBJECT_TYPE.IMAGE]: [],
    [OBJECT_TYPE.LINE]: [],
    [OBJECT_TYPE.RECT]: [],
    [OBJECT_TYPE.GROUP]: [],
  },
);

export const isCreateEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & CreateEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.CREATE;
};

export const supportCreateEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.CREATE][object.type];
};

export const isRemoveEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & RemoveEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.REMOVE;
};

export const supportRemoveEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.REMOVE][object.type];
};

export const isFadeEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & FadeEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.FADE;
};

export const supportFadeEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.FADE][object.type];
};

export const isFillEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & FillEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.FILL;
};

export const supportFillEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.FILL][object.type];
};

export const isRectEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & RectEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.RECT;
};

export const supportRectEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.RECT][object.type];
};

export const isRotateEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & RotateEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.ROTATE;
};

export const supportRotateEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.ROTATE][object.type];
};

export const isScaleEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & ScaleEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.SCALE;
};

export const supportScaleEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.SCALE][object.type];
};

export const isStrokeEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & StrokeEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.STROKE;
};

export const supportStrokeEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.STROKE][object.type];
};

export const isTextEffect = <T extends QueueEffectType>(
  effect: T,
): effect is T & TextEffect => {
  return effect.type === OBJECT_EFFECT_TYPE.TEXT;
};

export const supportTextEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.TEXT][object.type];
};
