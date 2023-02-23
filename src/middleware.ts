import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { TypedStartListening } from '@reduxjs/toolkit';

import type { RootState, AppDispatch } from './store';

export interface TypedListenerMiddleware {
  middleware: ReturnType<typeof createListenerMiddleware>['middleware'];
  startListening: TypedStartListening<RootState, AppDispatch>;
  stopListening: ReturnType<typeof createListenerMiddleware>['stopListening'];
  clearListeners: ReturnType<typeof createListenerMiddleware>['clearListeners'];
}

export const createTypedListenerMiddleware = (): TypedListenerMiddleware => {
  const middleware = createListenerMiddleware();
  const startListening = middleware.startListening as TypedStartListening<RootState, AppDispatch>;
  return {
    middleware: middleware.middleware,
    startListening: startListening,
    stopListening: middleware.stopListening,
    clearListeners: middleware.clearListeners,
  };
};
