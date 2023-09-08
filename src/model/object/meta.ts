export const OBJECT_TYPE = {
  GROUP: 'group',
  RECT: 'rect',
  CIRCLE: 'circle',
  ICON: 'icon',
  LINE: 'line',
  IMAGE: 'image',
} as const;

export type OBJECT_TYPES = (typeof OBJECT_TYPE)[keyof typeof OBJECT_TYPE];
