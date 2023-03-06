import { createAction } from '@reduxjs/toolkit';
import { SUPPORTED_LANGUAGES } from './model';

const changeLanguage = createAction<{
  language: SUPPORTED_LANGUAGES;
}>('preferences/changeLanguage');

export const PreferencesActions = {
  changeLanguage,
};
