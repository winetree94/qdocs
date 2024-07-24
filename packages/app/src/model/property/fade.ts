import { OBJECT_PROPERTY_TYPE } from '@legacy/model/property/meta';

export interface QueueFade {
  opacity: number;
}

export interface WithFade {
  [OBJECT_PROPERTY_TYPE.FADE]: QueueFade;
}
