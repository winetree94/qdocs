import { createContext, useMemo, useRef } from 'react';
import { EventCallback, EventPayloadAction } from './hooks';

interface EventDispatcherContextType {
  subscribe: <P = void>(eventName: string, emitter: EventCallback<P>) => void;
  unsubscribe: <P = void>(eventName: string, emitter: EventCallback<P>) => void;
  dispatch: <P = void>(payload: EventPayloadAction<P>) => void;
}

export const EventDispatcherContext = createContext<EventDispatcherContextType>(null);

export type EventDispatcherProviderProps = {
  children: React.ReactNode;
};

export const EventDispatcherProvider = ({ children }: EventDispatcherProviderProps) => {
  const listeners = useRef<Record<string, EventCallback<never>[]>>({});

  const subscribe = <P = void,>(eventName: string, emitter: EventCallback<P>): void => {
    listeners.current = {
      ...listeners.current,
      [eventName]: [...(listeners.current[eventName] || []), emitter],
    };
  };

  const unsubscribe = <P = void,>(eventName: string, emitter: EventCallback<P>): void => {
    listeners.current = {
      ...listeners.current,
      [eventName]: (listeners.current[eventName] || []).filter((listener) => listener !== emitter),
    };
  };

  const dispatch = <P = void,>(payload: EventPayloadAction<P>): void => {
    const emitters = listeners.current[payload.type] as EventCallback<P>[];
    if (!emitters) {
      return;
    }
    emitters.forEach((emitter) => emitter(payload));
  };

  const memoizedValue = useMemo(
    () => ({
      subscribe,
      unsubscribe,
      dispatch,
    }),
    [],
  );

  return <EventDispatcherContext.Provider value={memoizedValue}>{children}</EventDispatcherContext.Provider>;
};
