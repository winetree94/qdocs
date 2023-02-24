import { createAction } from '@reduxjs/toolkit';

const rewind = createAction('settings/rewind');

const play = createAction('settings/play');

export const SettingsActions = {
  rewind,
  play,
};
