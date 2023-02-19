import { atom, DefaultValue, selector } from 'recoil';
import { objectsByUUID } from './object';

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

/**
 * @description
 * 확대 배율을 관리하는 selector
 */
export const scale = selector({
  key: 'scale',
  get: ({ get }) => get(documentSettingsState).scale,
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const settings = get(documentSettingsState);
    set(documentSettingsState, {
      ...settings,
      scale: Math.max(newValue, 0.25),
    });
  },
});

/**
 * @description
 * 현재 페이지를 관리하는 selector
 */
export const page = selector({
  key: 'page',
  get: ({ get }) => get(documentSettingsState).queuePage,
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const settings = get(documentSettingsState);
    set(documentSettingsState, {
      ...settings,
      queuePage: Math.min(Math.max(newValue, 0), 100),
    });
  }
});

/**
 * @description
 * 선택된 오브젝트를 관리하는 selector
 */
export const selectedObject = selector({
  key: 'getSelectedObjects',
  get: ({ get }) => {
    const settings = get(documentSettingsState);
    const objects = get(objectsByUUID(settings.queuePage));
    return settings.selectedObjectUUIDs.map((uuid) => objects[uuid]);
  },
  set: ({ set, get }, newValues) => {
    if (newValues instanceof DefaultValue) {
      return;
    }
    const settings = get(documentSettingsState);
    set(documentSettingsState, {
      ...settings,
      selectedObjectUUIDs: newValues.map((object) => object.uuid),
    });
  },
});
