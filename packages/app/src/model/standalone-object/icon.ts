import {
  QueueFade,
  QueueFill,
  QueueRect,
  QueueRotate,
  QueueScale,
} from 'model/property';

export interface StandaloneIconObject {
  rect: QueueRect;
  rotate: QueueRotate;
  fade: QueueFade;
  scale: QueueScale;
  fill: QueueFill;
  iconType: string;
}
