import { ObjectResizer } from 'cdk/resizer/Resizer';
import { QueueObjectContainer } from './Container';
import { Draggable } from './Draggable';
import { LegacyQueueObject } from './EditableObject';
import { ObjectAnimator } from './QueueAnimation';
import { Rect } from './Rect';
import { Text } from './Text';

export const QueueObject = {
  Drag: Draggable,
  Container: QueueObjectContainer,
  Legacy: LegacyQueueObject,
  Animator: ObjectAnimator,
  Rect: Rect,
  Resizer: ObjectResizer,
  Text: Text,
};
