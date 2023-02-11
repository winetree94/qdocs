import { ease } from './ease';
import { easeIn } from './ease-in';
import { easeInOut } from './ease-in-out';
import { easeOut } from './ease-out';
import { linear } from './linear';

export type AnimatorTimingFunctionType =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out';

export const getTimingFunction = (
  type: AnimatorTimingFunctionType
): ((timeFraction: number) => number) => {
  switch (type) {
    case 'linear':
      return linear;
    case 'ease':
      return ease;
    case 'ease-in':
      return easeIn;
    case 'ease-out':
      return easeOut;
    case 'ease-in-out':
      return easeInOut;
  }
};
