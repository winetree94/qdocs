import { ObjectResizer } from 'cdk/resizer/Resizer';
import { QueueObjectContainer } from './Container';
import { Draggable } from './Draggable';
import { LegacyQueueObject } from './EditableObject';
import { ObjectAnimator } from './QueueAnimation';
import { Rect } from './Rect';

export const QueueObject = {
  Drag: Draggable,
  Conatiner: QueueObjectContainer,
  Legacy: LegacyQueueObject,
  Animator: ObjectAnimator,
  Rect: Rect,
  Resizer: ObjectResizer,
};
