import { QueueDocument } from '../../model/document';

export type NormalizedQueueDocument = Omit<QueueDocument, 'pages'>;
