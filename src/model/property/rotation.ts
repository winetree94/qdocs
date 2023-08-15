import { OBJECT_PROPERTY_META } from 'model/property/meta';

export type QueueRotate = {
  degree: number;
};

export type WithRotation = {
  [OBJECT_PROPERTY_META.ROTATE]: QueueRotate;
};
