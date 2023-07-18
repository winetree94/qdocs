export const OBJECT_META = {
  RECT: 'rect',
  CIRCLE: 'circle',
  ICON: 'icon',
  LINE: 'line',
} as const;

export const OBJECT_PROPERTY_META = {
  FADE: 'fade',
  FILL: 'fill',
  RECT: 'rect',
  ROTATE: 'rotate',
  SCALE: 'scale',
  STROKE: 'stroke',
  TEXT: 'text',
  IMAGE: 'image',
} as const;

export type OBJECT_PROPERTIES = (typeof OBJECT_PROPERTY_META)[keyof typeof OBJECT_PROPERTY_META];
