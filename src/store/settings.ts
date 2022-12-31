import { atom } from 'recoil';

export interface QueueDocumentSettings {
  scale: number;
  presentationMode: boolean;
}

export const documentSettingsState = atom<QueueDocumentSettings>({
  key: 'documentSettingsState',
  default: {
    scale: 0.2,
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
