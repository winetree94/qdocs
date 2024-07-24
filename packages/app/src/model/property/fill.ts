import { OBJECT_PROPERTY_TYPE } from '@legacy/model/property/meta';

export interface QueueFill {
  color: string;
  opacity: number;
}

export interface WithFill {
  [OBJECT_PROPERTY_TYPE.FILL]: QueueFill;
}
