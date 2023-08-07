import { InputHTMLAttributes } from 'react';

export type QueueControlInputBoxUnitType = 'percent' | 'degree' | 'pt';

export interface QueueControlInputBoxAllProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'outline' | 'filled' | 'standard';
  margin?: string;
  color?: string;
  padding?: string;
  iconImg?: string;
  width?: string;
  unit: QueueControlInputBoxUnitType;
  maxValue?: number;
  children?: React.ReactNode;
  valueChangeEvent?: (e: number) => void;
}

export interface QueueControlInputWrapperProps {
  variant?: 'outline' | 'filled' | 'standard';
  margin?: string;
  color?: string;
  padding?: string;
  width?: string;
  children?: React.ReactNode;
}

export interface QueueControlInputPrefixIconProps {
  prefixType: 'img' | 'class' | 'svg';
  prefixValue: string;
}

export interface QueueControlInputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  margin?: string;
  padding?: string;
  unit: QueueControlInputBoxUnitType;
  maxValue?: number;
  children?: React.ReactNode;
  valueChangeEvent?: (e: number) => void;
}