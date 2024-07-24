import { OBJECT_PROPERTY_TYPE } from '@legacy/model/property/meta';

export type QueueRotate = {
  degree: number;
};

export type WithRotation = {
  [OBJECT_PROPERTY_TYPE.ROTATE]: QueueRotate;
};
