import { createSlice } from '@reduxjs/toolkit';
import { PreferencesActions } from './actions';
import { SUPPORTED_LANGUAGE, SUPPORTED_LANGUAGES } from './model';

const initLang: SUPPORTED_LANGUAGES = (() => {
  const savedLanguage = localStorage.getItem('lang') as SUPPORTED_LANGUAGES;
  const validLang = Object.values(SUPPORTED_LANGUAGE).includes(savedLanguage);
  return validLang ? savedLanguage : SUPPORTED_LANGUAGE.AUTO;
})();

export interface QueuePreferences {
  language: SUPPORTED_LANGUAGES;
}

const initialState: QueuePreferences = {
  language: initLang,
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
