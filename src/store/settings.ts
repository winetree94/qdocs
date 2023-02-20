import { atom, selector } from 'recoil';

export interface QueueDocumentSettings {
  queuePage: number;
  queueIndex: number;
  queueStart: number;
  queuePosition: 'forward' | 'backward' | 'pause';
  selectionMode: 'normal' | 'detail';
  selectedObjectUUIDs: string[];
  scale: number;
  presentationMode: boolean;
}

export const documentSettingsState = atom<QueueDocumentSettings>({
  key: 'documentSettingsState',
  default: {
    queuePage: 0,
    queueIndex: 0,
    queueStart: 0,
    queuePosition: 'forward',
    selectionMode: 'normal',
    selectedObjectUUIDs: [],
    scale: 0.25,
    presentationMode: false,
  },
});

export const currentQueueRanges = selector<number[]>({
  key: 'currentQueueRanges',
  get: ({ get }) => {
    const { queueIndex } = get(documentSettingsState);
    const ranges: number[] = [];
    const rangeStart = Math.max(queueIndex - 2, 0);
    const rangeEnd = rangeStart + 5;
    for (let i = rangeStart; i < rangeEnd; i++) {
      ranges.push(i);
    }
    return ranges;
  }
});
