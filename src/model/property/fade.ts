import { OBJECT_PROPERTY_META } from './meta';

export interface QueueFade {
  opacity: number;
}

export interface WithFade {
  [OBJECT_PROPERTY_META.FADE]: QueueFade;
}
