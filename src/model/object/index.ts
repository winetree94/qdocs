import { QueueCircle } from './circle';
import { QueueIcon } from './icon';
import { QueueLine } from './line';
import { QueueSquare } from './square';

export * from './circle';
export * from './icon';
export * from './square';

export type QueueObjectType = QueueSquare | QueueCircle | QueueIcon | QueueLine;
