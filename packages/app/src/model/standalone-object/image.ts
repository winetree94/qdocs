import { EntityId } from '@reduxjs/toolkit';
import {
  QueueFade,
  QueueFill,
  QueueRect,
  QueueRotate,
  QueueScale,
  QueueStroke,
  QueueImage,
} from '@legacy/model/property';

export interface StandaloneImageObject {
  objectId: EntityId;
  rect: QueueRect;
  stroke: QueueStroke;
  rotate: QueueRotate;
  fade: QueueFade;
  scale: QueueScale;
  fill: QueueFill;
  image: QueueImage;
}
