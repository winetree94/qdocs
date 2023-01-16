import { atom } from 'recoil';
import { QueueDocument } from './document';

export interface QueueDocumentHistory {
  previous: QueueDocument[];
  next: QueueDocument[];
}

export const queueDocumentHistoryState = atom<QueueDocumentHistory>({
  key: 'queueDocumentHistoryState',
  default: {
    previous: [],
    next: [],
  },
});

export function popPrevious(): void {
  return;
}
