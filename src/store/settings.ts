import {
  atom,
  selector,
} from 'recoil';
import {
  documentState,
} from './document';

export interface QueueDocumentSettings {
  queuePage: number;
  queueIndex: number;
  queueStart: number,
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
  effects: [
    ({ onSet, setSelf }): void => {
      onSet((newValue, oldValue) => {
        return;
      });
    },
  ],
});

export const getSelectedObjects = selector({
  key: 'getSelectedObjects',
  get: ({ get }) => {
    const queueDocument = get(documentState);
    const settings = get(documentSettingsState);
    return queueDocument!.pages[settings.queuePage].objects
      .filter((object) => settings.selectedObjectUUIDs.includes(object.uuid));
  }
});
