/* eslint-disable @typescript-eslint/no-explicit-any */

import { QueueObjectType } from 'model/object';
import { createContext } from 'react';
import { NormalizedQueueObjectType } from '../../store/object/model';

export interface QueueObjectContainerContextType<T extends QueueObjectType> {
  object: T;
  documentScale: number;
  detail: boolean;
  selected: boolean;
}

export const QueueObjectContainerContext = createContext<
  QueueObjectContainerContextType<any>
>({} as QueueObjectContainerContextType<any>);

export interface QueueObjectContainerProps {
  documentScale: number;
  object: NormalizedQueueObjectType;
  detail: boolean;
  selected: boolean;
  children: React.ReactNode;
}

export const QueueObjectContainer = ({
  children,
  selected,
  detail,
  documentScale,
  object,
}: QueueObjectContainerProps) => {
  return (
    <QueueObjectContainerContext.Provider
      value={{
        object,
        selected,
        detail,
        documentScale,
      }}>
      {children}
    </QueueObjectContainerContext.Provider>
  );
};
