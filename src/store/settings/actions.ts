import { createAction } from '@reduxjs/toolkit';
import { QueueDocumentSettings } from './reducer';

export const setSettings = createAction<QueueDocumentSettings>('Settings/setSettings');