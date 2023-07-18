export const QUEUE_UI_COLOR = {
  DEFAULT: 'default',
  BLUE: 'blue',
  RED: 'red',
} as const;

export type QUEUE_UI_COLORS = (typeof QUEUE_UI_COLOR)[keyof typeof QUEUE_UI_COLOR];
