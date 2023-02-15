import { OBJECT_PROPERTY_META } from '../meta';

export interface QueueScale {
  scale: number;
}

export interface WithScale {
  [OBJECT_PROPERTY_META.SCALE]: QueueScale;
}
