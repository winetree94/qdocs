import { bounce } from './bounce';
import { easeOut } from './ease-out';
import { linear } from './linear';

export type AnimatorTimingFunctionType = 'linear' | 'ease-out';

export const getTimingFunction = (
  type: AnimatorTimingFunctionType,
): (timeFraction: number) => number => {
  switch (type) {
    case 'linear': return linear;
    case 'ease-out': return easeOut(bounce);
  }
};