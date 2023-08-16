import { OBJECT_EFFECT_TYPE } from 'model/effect';
import { OBJECT_TYPE, QueueObjectType } from 'model/object';

const EFFECT_SUPPORTED_MAP = {
  [OBJECT_EFFECT_TYPE.CREATE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.REMOVE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.FADE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.FILL]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.RECT]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.ROTATE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.SCALE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.STROKE]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
  [OBJECT_EFFECT_TYPE.TEXT]: {
    [OBJECT_TYPE.CIRCLE]: true,
    [OBJECT_TYPE.ICON]: true,
    [OBJECT_TYPE.IMAGE]: true,
    [OBJECT_TYPE.LINE]: true,
    [OBJECT_TYPE.RECT]: true,
  },
};

export const supportCreateEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.CREATE][object.type];
};

export const supportRemoveEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.REMOVE][object.type];
};

export const supportFadeEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.FADE][object.type];
};

export const supportFillEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.FILL][object.type];
};

export const supportRectEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.RECT][object.type];
};

export const supportRotateEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.ROTATE][object.type];
};

export const supportScaleEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.SCALE][object.type];
};

export const supportStrokeEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.STROKE][object.type];
};

export const supportTextEffect = <T extends QueueObjectType>(
  object: T,
): boolean => {
  return EFFECT_SUPPORTED_MAP[OBJECT_EFFECT_TYPE.TEXT][object.type];
};
