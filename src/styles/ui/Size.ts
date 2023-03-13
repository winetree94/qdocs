export const QUEUE_UI_SIZE = {
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
} as const;

export type QUEUE_UI_SIZES = typeof QUEUE_UI_SIZE[keyof typeof QUEUE_UI_SIZE];
