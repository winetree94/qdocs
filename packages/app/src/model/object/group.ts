import { OBJECT_TYPE } from './meta';
import { BaseObject } from './base';
import {
  WithFade,
  WithRect,
  WithRotation,
  WithScale,
  WithText,
} from 'model/property';

export interface QueueGroupObject
  extends BaseObject,
    WithRect,
    WithFade,
    WithRotation,
    WithScale,
    WithText {
  type: typeof OBJECT_TYPE.GROUP;
}
