import { createSlice, EntityId } from '@reduxjs/toolkit';
import { QueueDocumentSettings } from './model';
import { DocumentActions } from '../document';
import { SettingsActions } from './actions';

const initialState: QueueDocumentSettings = {
  pageId: '',
  queueIndex: 0,
  queueStart: -1,
  autoPlay: false,
  autoPlayRepeat: false,
  queuePosition: 'forward',
  selectionMode: 'normal',
  selectedObjectIds: [],
  scale: 0.25,
  presentationMode: false,
  bottomPanelOpened: true,
  leftPanelOpened: true,
};

export interface DetailSelectionAction {
  selectionMode: 'detail';
  id: EntityId;
}

export interface NormalSelectionAction {
  selectionMode: 'normal';
  ids: EntityId[];
}

export const documentSettingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * @description
     * 새로운 문서 열람시 초기화
     */
    builder.addCase(
      DocumentActions.loadDocument,
      (state, action): QueueDocumentSettings => {
        if (!action.payload) {
          return { ...initialState };
        }
        return {
          ...state,
          ...initialState,
          pageId: action.payload.pages.ids[0],
        };
      },
    );

    builder.addCase(
      SettingsActions.updateSettings,
      (state, action): QueueDocumentSettings => {
        return { ...state, ...action.payload.changes };
      },
    );

    builder.addCase(
      SettingsActions.setSettings,
      (state, action): QueueDocumentSettings => {
        return { ...state, ...action.payload };
      },
    );

    builder.addCase(
      SettingsActions.setScale,
      (state, action): QueueDocumentSettings => {
        return {
          ...state,
          scale: Math.max(action.payload, 0.25),
        };
      },
    );

    builder.addCase(
      SettingsActions.increaseScale,
      (state): QueueDocumentSettings => {
        return {
          ...state,
          scale: Math.max(state.scale + 0.05, 0.25),
        };
      },
    );

    builder.addCase(
      SettingsActions.decreaseScale,
      (state): QueueDocumentSettings => {
        return {
          ...state,
          scale: Math.max(state.scale - 0.05, 0.25),
        };
      },
    );

    builder.addCase(
      SettingsActions.movePage,
      (state, action): QueueDocumentSettings => {
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
    );

    builder.addCase(
      SettingsActions.setSelection,
      (state, action): QueueDocumentSettings => {
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
    );

    builder.addCase(
      SettingsActions.addSelection,
      (state, action): QueueDocumentSettings => {
        return {
          ...state,
          selectionMode: 'normal',
          selectedObjectIds: [...state.selectedObjectIds, action.payload],
        };
      },
    );

    builder.addCase(
      SettingsActions.removeSelection,
      (state, action): QueueDocumentSettings => {
        return {
          ...state,
          selectionMode: 'normal',
          selectedObjectIds: state.selectedObjectIds.filter(
            (id) => !action.payload.includes(id),
          ),
        };
      },
    );

    builder.addCase(
      SettingsActions.resetSelection,
      (state): QueueDocumentSettings => {
        return {
          ...state,
          selectionMode: 'normal',
          selectedObjectIds: [],
        };
      },
    );

    builder.addCase(
      SettingsActions.setPresentationMode,
      (state, action): QueueDocumentSettings => {
        return {
          ...state,
          presentationMode: action.payload,
          selectedObjectIds: [],
          selectionMode: 'normal',
        };
      },
    );

    builder.addCase(SettingsActions.pause, (state) => {
      state.autoPlay = false;
      state.queueStart = -1;
      state.queuePosition = 'pause';
    });

    builder.addCase(SettingsActions.play, (state) => {
      state.autoPlay = true;
      state.queueStart = performance.now();
      state.queuePosition = 'forward';
    });

    builder.addCase(SettingsActions.setRepeat, (state, action) => {
      state.autoPlayRepeat = action.payload;
    });

    builder.addCase(
      SettingsActions.setQueueIndex,
      (state, action): QueueDocumentSettings => {
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
    );
  },
});
