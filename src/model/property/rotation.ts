import { OBJECT_PROPERTY_META } from './meta';

export interface QueueRotate {
  position: 'forward' | 'reverse';
  degree: number;
}

export interface WithRotation {
  [OBJECT_PROPERTY_META.ROTATE]: QueueRotate;
}
