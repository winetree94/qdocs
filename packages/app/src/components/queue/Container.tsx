/* eslint-disable @typescript-eslint/no-explicit-any */

import { QueueObjectType } from '@legacy/model/object';
import { createContext } from 'react';

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
  object: QueueObjectType;
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
