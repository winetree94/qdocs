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

export type OBJECT_EFFECT_TYPES =
  (typeof OBJECT_EFFECT_TYPE)[keyof typeof OBJECT_EFFECT_TYPE];
