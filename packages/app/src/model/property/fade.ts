import { OBJECT_PROPERTY_TYPE } from 'model/property/meta';

export interface QueueFade {
  opacity: number;
}

export interface WithFade {
  [OBJECT_PROPERTY_TYPE.FADE]: QueueFade;
}
