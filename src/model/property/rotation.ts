import { OBJECT_PROPERTY_META } from '../meta';

export type QueueRotate = {
  degree: number;
}

export type WithRotation = {
  [OBJECT_PROPERTY_META.ROTATE]: QueueRotate;
}
