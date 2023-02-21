import { useContext, useEffect } from 'react';
import { EventDispatcherContext } from './context';

export interface EventPayloadAction<P = void> {
  type: string;
  payload: P;
}

export type PayloadActionCreatorWithPrepared<P = void> = ((payload: P) => EventPayloadAction<P>) & { type: string };
export type EventCallback<P = void> = (action: EventPayloadAction<P>) => void;

export const createEvent = <P = void>(type: string): PayloadActionCreatorWithPrepared<P> => {
  function actionCreator(payload: P): EventPayloadAction<P> {
    return {
      type,
      payload,
    };
  }
  actionCreator.type = type;
  return actionCreator;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEventDispatch = (): ((payload: EventPayloadAction<any>) => void) => {
  const context = useContext(EventDispatcherContext);
  return context.dispatch;
};

export const useEventSelector = <P = void>(
  actionCreator: PayloadActionCreatorWithPrepared<P>,
  listener: EventCallback<P>,
): void => {
  const context = useContext(EventDispatcherContext);
  useEffect(() => {
    context.unsubscribe(actionCreator.type, listener);
    context.subscribe(actionCreator.type, listener);
    return () => context.unsubscribe(actionCreator.type, listener);
  }, [actionCreator.type, context, listener]);
};
