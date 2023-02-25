/* eslint-disable @typescript-eslint/no-explicit-any */

import { QueueObjectType } from 'model/object';
import { createContext, FunctionComponent } from 'react';
import { NormalizedQueueObjectType } from '../../store/object/model';

export interface QueueObjectContainerContextType<T extends QueueObjectType> {
  object: T;
  documentScale: number;
  detail: boolean;
  selected: boolean;
}

export const QueueObjectContainerContext = createContext<QueueObjectContainerContextType<any>>(
  {} as QueueObjectContainerContextType<any>,
);

export interface QueueObjectContainerProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  documentScale: number;
  object: NormalizedQueueObjectType;
  detail: boolean;
  selected: boolean;
  children: React.ReactNode;
}
export const QueueObjectContainer: FunctionComponent<QueueObjectContainerProps> = ({
  children,
  selected,
  detail,
  documentScale,
  object,
  ...props
}) => {
  return (
    <QueueObjectContainerContext.Provider
      value={{
        object,
        selected,
        detail,
        documentScale,
      }}>
      <div {...props}>{children}</div>
    </QueueObjectContainerContext.Provider>
  );
};
