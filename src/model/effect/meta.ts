export const OBJECT_EFFECT_META = {
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

export type OBJECT_EFFECTS = typeof OBJECT_EFFECT_META[keyof typeof OBJECT_EFFECT_META];
