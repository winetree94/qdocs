import { OBJECT_PROPERTY_META } from 'model/property/meta';

export interface QueueScale {
  scale: number;
}

export interface WithScale {
  [OBJECT_PROPERTY_META.SCALE]: QueueScale;
}
