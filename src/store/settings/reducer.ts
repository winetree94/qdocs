import { createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { loadDocument } from 'store/document/actions';

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

const initialState: QueueDocumentSettings = {
  queuePage: 0,
  queueIndex: 0,
  queueStart: 0,
  queuePosition: 'forward',
  selectionMode: 'normal',
  selectedObjectUUIDs: [],
  scale: 0.25,
  presentationMode: false,
};

export interface DetailSelectionAction {
  selectionMode: 'detail';
  uuid: string;
}

export interface NormalSelectionAction {
  selectionMode: 'normal';
  uuids: string[];
}

export const documentSettingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<QueueDocumentSettings>>) => {
      return { ...state, ...action.payload };
    },

    setSettings: (state, action: PayloadAction<QueueDocumentSettings>) => {
      return { ...state, ...action.payload };
    },

    setScale: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        scale: Math.max(action.payload, 0.25),
      };
    },

    increaseScale: (state) => {
      return {
        ...state,
        scale: Math.max(state.scale + 0.05, 0.25),
      };
    },

    decreaseScale: (state) => {
      return {
        ...state,
        scale: Math.max(state.scale - 0.05, 0.25),
      };
    },

    movePage: (
      state,
      action: PayloadAction<{
        pageIndex: number;
        queueIndex: number;
      }>,
    ) => {
      return {
        ...state,
        queuePage: Math.max(action.payload.pageIndex, 0),
        queueIndex: Math.max(action.payload.queueIndex, 0),
        queuePosition: 'pause',
        queueStart: -1,
        selectedObjectUUIDs: [],
        selectionMode: 'normal',
      };
    },

    setSelection: (state, action: PayloadAction<DetailSelectionAction | NormalSelectionAction>) => {
      const pending: Partial<QueueDocumentSettings> = {};

      switch (action.payload.selectionMode) {
        case 'detail':
          pending.queueStart = -1;
          pending.selectionMode = 'detail';
          pending.selectedObjectUUIDs = [action.payload.uuid];
          break;
        case 'normal':
          pending.queueStart = -1;
          pending.selectionMode = 'normal';
          pending.selectedObjectUUIDs = action.payload.uuids;
      }

      return {
        ...state,
        ...pending,
      };
    },

    addSelection: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        selectionMode: 'normal',
        selectedObjectUUIDs: [...state.selectedObjectUUIDs, action.payload],
      };
    },

    removeSelection: (state, action: PayloadAction<EntityId[]>) => {
      return {
        ...state,
        selectionMode: 'normal',
        selectedObjectUUIDs: state.selectedObjectUUIDs.filter((uuid) => !action.payload.includes(uuid)),
      };
    },

    resetSelection: (state) => {
      return {
        ...state,
        selectionMode: 'normal',
        selectedObjectUUIDs: [],
      };
    },

    setPresentationMode: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        presentationMode: action.payload,
        selectedObjectUUIDs: [],
        selectionMode: 'normal',
      };
    },

    stopAnimation: (state) => {
      return {
        ...state,
        queuePosition: 'pause',
        queueStart: -1,
      };
    },

    setQueueIndex: (
      state,
      action: PayloadAction<{
        queueIndex: number;
        play?: boolean;
      }>,
    ) => {
      return {
        ...state,
        queueIndex: Math.max(action.payload.queueIndex, 0),
        queuePosition: !action.payload.play
          ? 'pause'
          : state.queueIndex < action.payload.queueIndex
          ? 'forward'
          : 'backward',
        queueStart: action.payload.play ? performance.now() : -1,
        selectedObjectUUIDs: [],
        selectionMode: 'normal',
      };
    },
  },

  extraReducers: (builder) => {
    /**
     * @description
     * 새로운 문서 열람시 초기화
     */
    builder.addCase(loadDocument, () => initialState);
  },
});
