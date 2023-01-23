import { QueueObjectContainer } from './Container';
import { Draggable } from './Draggable';
import { ObjectAnimator } from './QueueAnimation';
import { Rect } from './Rect';
import { ObjectResizer } from './Resizer';
import { Text } from './Text';

export const QueueObject = {
  Drag: Draggable,
  Container: QueueObjectContainer,
  Animator: ObjectAnimator,
  Rect: Rect,
  Resizer: ObjectResizer,
  Text: Text,
};
