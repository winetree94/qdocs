export const TIMING_FUNCTION_META = {
  LINIER: 'linear',
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  BOUNCE: 'bounce',
} as const;

export type AnimatorTimingFunctionType =
  (typeof TIMING_FUNCTION_META)[keyof typeof TIMING_FUNCTION_META];

export const TIMING_FUNCTION_TRANSLATION_KEY = {
  [TIMING_FUNCTION_META.LINIER]: 'timing-function.linear',
  [TIMING_FUNCTION_META.EASE]: 'timing-function.ease',
  [TIMING_FUNCTION_META.EASE_IN]: 'timing-function.ease-in',
  [TIMING_FUNCTION_META.EASE_OUT]: 'timing-function.ease-out',
  [TIMING_FUNCTION_META.EASE_IN_OUT]: 'timing-function.ease-in-out',
  [TIMING_FUNCTION_META.BOUNCE]: 'timing-function.bounce',
} as const;
