import { OBJECT_PROPERTY_TYPE } from '@legacy/model/property/meta';

export type QueueStroke = {
  dasharray: string;
  width: number;
  color: string;
};

export interface WithStroke {
  [OBJECT_PROPERTY_TYPE.STROKE]: QueueStroke;
}
