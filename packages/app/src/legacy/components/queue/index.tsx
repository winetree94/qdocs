import { QueueObjectContainer } from './Container';
import { QueueObjectContextContent } from './Context';
import { ObjectAnimator } from './QueueAnimation';
import { Rect } from './Rect';
import { ObjectResizer } from './Resizer';
import { Text } from './Text';

export const QueueObject = {
  Container: QueueObjectContainer,
  ContextContent: QueueObjectContextContent,
  Animator: ObjectAnimator,
  Rect: Rect,
  Resizer: ObjectResizer,
  Text: Text,
};
