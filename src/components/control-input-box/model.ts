export type QueueControlInputBoxUnitType = 'percent' | 'degree' | 'pt';

export interface QueueControlInputBoxAllProps {
  placeholder?: string;
  defaultValue?: number;
  variant?: 'outline' | 'filled' | 'standard';
  size?: string;
  margin?: string;
  padding?: string;
  color?: string;
  label?: string;
  subDescription?: string;
  iconImg?: string;
  width?: string;
  unit: QueueControlInputBoxUnitType;
  maxValue?: number;
  children?: React.ReactNode;
  valueChangeEvent?: (e: number) => void;
}

// export interface QueueControlInputRootProps {
//   children?: React.ReactNode;
// }