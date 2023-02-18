import { QueueObjectContainer } from './Container';
import { QueueObjectContextContent } from './Context';
import { Draggable } from './Draggable';
import { ObjectAnimator } from './QueueAnimation';
import { Rect } from './Rect';
import { ObjectResizer } from './Resizer';
import { Text } from './Text';

export const QueueObject = {
  Drag: Draggable,
  Container: QueueObjectContainer,
  ContextContent: QueueObjectContextContent,
  Animator: ObjectAnimator,
  Rect: Rect,
  Resizer: ObjectResizer,
  Text: Text,
};
