import { OBJECT_PROPERTY_TYPE } from 'model/property/meta';

export interface QueueScale {
  scale: number;
}

export interface WithScale {
  [OBJECT_PROPERTY_TYPE.SCALE]: QueueScale;
}
