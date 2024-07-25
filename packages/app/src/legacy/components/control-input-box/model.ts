import { InputHTMLAttributes } from 'react';

export type QueueControlInputBoxUnitType = 'percent' | 'degree' | 'pt';

export interface QueueControlInputWrapperProps {
  variant?: 'outline' | 'filled' | 'standard';
  color?: string;
  margin?: string;
  padding?: string;
  width?: string;
  children?: React.ReactNode;
}

export interface QueueControlInputPrefixIconProps {
  prefixType: 'img' | 'class' | 'svg';
  prefixValue: string;
}

export interface QueueControlInputBoxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  padding?: string;
  unit: QueueControlInputBoxUnitType;
  maxValue?: number;
  minValue?: number;
  valueChangeEvent?: (e: number) => void;
}
