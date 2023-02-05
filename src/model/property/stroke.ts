import {
  OBJECT_PROPERTY_META,
} from './meta';

export interface QueueStroke {
  dasharray: string;
  width: number;
  color: string;
}

export interface WithStroke {
  [OBJECT_PROPERTY_META.STROKE]: QueueStroke;
}
