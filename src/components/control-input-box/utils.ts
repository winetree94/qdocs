import { QueueControlInputBoxUnitType } from './model';

export const isValidateValue = (value: string): boolean => {
    return /^\d+(\u0025|\u00B0|pt)$/.test(value) || /^\d+$/.test(value);
  };

  export  const isValidLimit = (value: number, maxValue: number): boolean => {
    return 0 <= value && value <= maxValue;
  };

  export const getUnitSymbol = (unit: QueueControlInputBoxUnitType): string => {
    if (unit === 'percent') {
      return '\u0025';
    }

    if (unit === 'degree') {
      return '\u00B0';
    }

    if (unit === 'pt') {
      return 'pt';
    }
  };