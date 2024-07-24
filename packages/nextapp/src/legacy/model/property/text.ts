import { OBJECT_PROPERTY_TYPE } from '@legacy/model/property/meta';

export interface QueueText {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  verticalAlign: 'top' | 'middle' | 'bottom';
  horizontalAlign: 'left' | 'center' | 'right' | 'justify';
}

export interface WithText {
  [OBJECT_PROPERTY_TYPE.TEXT]: QueueText;
}
