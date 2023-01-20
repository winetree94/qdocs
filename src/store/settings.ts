import { atom } from 'recoil';

export interface QueueDocumentSettings {
  queueIndex: number;
  queueStart: number,
  queuePosition: 'forward' | 'backward' | 'pause';
  selectionMode: 'single' | 'multiple' | 'none';
  selectedObjects: string[];
  scale: number;
  presentationMode: boolean;
}

export const documentSettingsState = atom<QueueDocumentSettings>({
  key: 'documentSettingsState',
  default: {
    queueIndex: 0,
    queueStart: 0,
    queuePosition: 'forward',
    selectionMode: 'none',
    selectedObjects: [],
    scale: 0.25,
    presentationMode: false,
  } as QueueDocumentSettings,
  effects: [
    ({ onSet, setSelf }): void => {
      onSet((newValue, oldValue) => {
        return;
      });
    },
  ],
});
