import {
  WithFade,
  WithFill,
  WithRect,
  WithRotation,
  WithScale,
  WithText,
} from 'model/property';
import { WithImage } from 'model/property/image';
import { EntityId } from '@reduxjs/toolkit';

export interface QueueObjectGroup
  extends WithRect,
    WithFade,
    WithFill,
    WithRotation,
    WithScale,
    WithText,
    WithImage {
  type: 'objectGroup';
  index: number;
  id: EntityId;
  pageId: EntityId;
}
