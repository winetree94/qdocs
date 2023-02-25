import { createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { loadDocument } from 'store/document/actions';
import { QueueDocumentSettings } from './model';

const initialState: QueueDocumentSettings = {
  documentId: '',
  pageId: '',
  queueIndex: 0,
  queueStart: 0,
  queuePosition: 'forward',
  selectionMode: 'normal',
  selectedObjectIds: [],
  scale: 0.25,
  presentationMode: false,
};

export interface DetailSelectionAction {
  selectionMode: 'detail';
  id: string;
}

export interface NormalSelectionAction {
  selectionMode: 'normal';
  ids: string[];
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
        pageIndex: string;
        pageId: number;
      }>,
    ) => {
      return {
        ...state,
        pageId: action.payload.pageIndex,
        queueIndex: Math.max(action.payload.pageId, 0),
        queuePosition: 'pause',
        queueStart: -1,
        selectedObjectIds: [],
        selectionMode: 'normal',
      };
    },

    setSelection: (state, action: PayloadAction<DetailSelectionAction | NormalSelectionAction>) => {
      const pending: Partial<QueueDocumentSettings> = {};

      switch (action.payload.selectionMode) {
        case 'detail':
          pending.queueStart = -1;
          pending.selectionMode = 'detail';
          pending.selectedObjectIds = [action.payload.id];
          break;
        case 'normal':
          pending.queueStart = -1;
          pending.selectionMode = 'normal';
          pending.selectedObjectIds = action.payload.ids;
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
        selectedObjectIds: [...state.selectedObjectIds, action.payload],
      };
    },

    removeSelection: (state, action: PayloadAction<EntityId[]>) => {
      return {
        ...state,
        selectionMode: 'normal',
        selectedObjectIds: state.selectedObjectIds.filter((id) => !action.payload.includes(id)),
      };
    },

    resetSelection: (state) => {
      return {
        ...state,
        selectionMode: 'normal',
        selectedObjectIds: [],
      };
    },

    setPresentationMode: (state, action: PayloadAction<boolean>): QueueDocumentSettings => {
      return {
        ...state,
        presentationMode: action.payload,
        selectedObjectIds: [],
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
        selectedObjectIds: [],
        selectionMode: 'normal',
      };
    },
  },

  extraReducers: (builder) => {
    /**
     * @description
     * 새로운 문서 열람시 초기화
     */
    builder.addCase(loadDocument, (state, action): QueueDocumentSettings => {
      return {
        ...initialState,
        documentId: action.payload.id,
        pageId: action.payload.pages[0].id,
      };
    });
  },
});
