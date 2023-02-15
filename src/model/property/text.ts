import { OBJECT_PROPERTY_META } from '../meta';

export interface QueueText {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  verticalAlign: 'top' | 'middle' | 'bottom';
  horizontalAlign: 'left' | 'center' | 'right';
}

export interface WithText {
  [OBJECT_PROPERTY_META.TEXT]: QueueText;
}
