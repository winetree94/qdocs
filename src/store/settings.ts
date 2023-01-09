import { atom } from 'recoil';

export interface QueueDocumentSettings {
  queueIndex: number;
  queuePosition: 'forward' | 'backward' | 'pause';
  selectedObjects: string[];
  scale: number;
  presentationMode: boolean;
}

export const documentSettingsState = atom<QueueDocumentSettings>({
  key: 'documentSettingsState',
  default: {
    queueIndex: 0,
    queuePosition: 'forward',
    selectedObjects: [],
    scale: 0.25,
    presentationMode: false,
  },
  effects: [
    ({ onSet }): void => {
      onSet((newValue, oldValue) => {
        return;
      });
    },
  ],
});
