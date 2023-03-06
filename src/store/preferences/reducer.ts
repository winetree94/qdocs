import { createSlice } from '@reduxjs/toolkit';
import { PreferencesActions } from './actions';
import { SUPPORTED_LANGUAGE, SUPPORTED_LANGUAGES } from './model';

export interface QueuePreferences {
  language: SUPPORTED_LANGUAGES;
}

const initialState: QueuePreferences = {
  language: SUPPORTED_LANGUAGE.AUTO,
};

export const preferencesSlice = createSlice({
  name: 'perferences',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(PreferencesActions.changeLanguage, (state, action) => {
      state.language = action.payload.language;
    });
  },
});
