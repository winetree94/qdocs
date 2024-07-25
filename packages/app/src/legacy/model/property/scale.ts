import { OBJECT_PROPERTY_TYPE } from '@legacy/model/property/meta';

export interface QueueScale {
  scale: number;
}

export interface WithScale {
  [OBJECT_PROPERTY_TYPE.SCALE]: QueueScale;
}
