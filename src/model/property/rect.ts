import { OBJECT_PROPERTY_TYPE } from 'model/property/meta';

export type QueueRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface WithRect {
  [OBJECT_PROPERTY_TYPE.RECT]: QueueRect;
}
