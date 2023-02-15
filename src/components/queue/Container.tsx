/* eslint-disable @typescript-eslint/no-explicit-any */

import { QueueObjectType } from 'model/object';
import { QueueRotate } from 'model/property';
import { createContext, FunctionComponent } from 'react';

export interface QueueObjectContainerContextType<
  T extends QueueObjectType = any
> {
  object: T;
  documentScale: number;
  detail: boolean;
  selected: boolean;
}

export const QueueObjectContainerContext =
  createContext<QueueObjectContainerContextType>(
    {} as QueueObjectContainerContextType
  );

export interface QueueObjectContainerProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {
  documentScale: number;
  object: QueueObjectType;
  rotate?: QueueRotate;
  detail: boolean;
  selected: boolean;
  children: React.ReactNode;
}
export const QueueObjectContainer: FunctionComponent<
  QueueObjectContainerProps
> = ({
  children,
  selected,
  rotate,
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
