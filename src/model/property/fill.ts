import { OBJECT_PROPERTY_META } from './meta';

export interface QueueFill {
  color: string;
  opacity: number;
}

export interface WithFill {
  [OBJECT_PROPERTY_META.FILL]: QueueFill;
}
