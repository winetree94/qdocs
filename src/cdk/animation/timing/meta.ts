export const TIMING_FUNCTION_META = {
  LINIER: 'linear',
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  BOUNCE: 'bounce',
} as const;

export type AnimatorTimingFunctionType = (typeof TIMING_FUNCTION_META)[keyof typeof TIMING_FUNCTION_META];
