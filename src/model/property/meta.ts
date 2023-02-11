export const OBJECT_PROPERTY_META = {
  FADE: 'fade',
  FILL: 'fill',
  RECT: 'rect',
  ROTATE: 'rotate',
  SCALE: 'scale',
  STROKE: 'stroke',
  TEXT: 'text',
} as const;

export type OBJECT_PROPERTIES =
  typeof OBJECT_PROPERTY_META[keyof typeof OBJECT_PROPERTY_META];
