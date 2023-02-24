import { createAction } from '@reduxjs/toolkit';

const rewind = createAction('rewind');

const play = createAction('play');

export const SettingsActions = {
  rewind,
  play,
};
