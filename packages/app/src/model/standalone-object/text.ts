import {
  QueueFade,
  QueueRect,
  QueueRotate,
  QueueScale,
  QueueText,
} from 'model/property';

export interface StandaloneTextObject {
  rect: QueueRect;
  rotate: QueueRotate;
  fade: QueueFade;
  scale: QueueScale;
  text: QueueText;
}
