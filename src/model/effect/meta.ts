export const OBJECT_EFFECT_TYPE = {
  CREATE: 'create',
  FADE: 'fade',
  FILL: 'fill',
  RECT: 'rect',
  REMOVE: 'remove',
  ROTATE: 'rotate',
  SCALE: 'scale',
  STROKE: 'stroke',
  TEXT: 'text',
} as const;

export const OBJECT_EFFECT_TRANSLATION_KEY = {
  [OBJECT_EFFECT_TYPE.CREATE]: 'effect.create',
  [OBJECT_EFFECT_TYPE.FADE]: 'effect.fade',
  [OBJECT_EFFECT_TYPE.FILL]: 'effect.fill',
  [OBJECT_EFFECT_TYPE.RECT]: 'effect.rect',
  [OBJECT_EFFECT_TYPE.REMOVE]: 'effect.remove',
  [OBJECT_EFFECT_TYPE.ROTATE]: 'effect.rotate',
  [OBJECT_EFFECT_TYPE.SCALE]: 'effect.scale',
  [OBJECT_EFFECT_TYPE.STROKE]: 'effect.stroke',
  [OBJECT_EFFECT_TYPE.TEXT]: 'effect.text',
} as const;

export type OBJECT_EFFECT_TYPES =
  (typeof OBJECT_EFFECT_TYPE)[keyof typeof OBJECT_EFFECT_TYPE];
