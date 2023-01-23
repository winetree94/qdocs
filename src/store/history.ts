import { QueueDocument } from 'model/document';
import { atom } from 'recoil';

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
