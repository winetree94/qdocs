export const OBJECT_PROPERTY_TYPE = {
  FADE: 'fade',
  FILL: 'fill',
  RECT: 'rect',
  ROTATE: 'rotate',
  SCALE: 'scale',
  STROKE: 'stroke',
  TEXT: 'text',
  IMAGE: 'image',
} as const;

export type OBJECT_PROPERTY_TYPES =
  (typeof OBJECT_PROPERTY_TYPE)[keyof typeof OBJECT_PROPERTY_TYPE];
