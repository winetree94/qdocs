/* eslint-disable @typescript-eslint/no-explicit-any */

import { QueueObjectType } from 'model/object';
import { QueueRect, QueueRotate } from 'model/property';
import { createContext, FunctionComponent } from 'react';

export interface QueueObjectContainerContextType<
  T extends QueueObjectType = any
> {
  object: T;
  documentScale: number;
  detail: boolean;
  selected: boolean;
  transformRotate: QueueRotate;
  move?: Pick<QueueRect, 'x' | 'y'>;
  transform: QueueRect;
}

export const QueueObjectContainerContext =
  createContext<QueueObjectContainerContextType>(
    {} as QueueObjectContainerContextType
  );

export interface QueueObjectContainerProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {
  documentScale: number;
  object: QueueObjectType;
  move?: Pick<QueueRect, 'x' | 'y'>;
  transform?: QueueRect;
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
  transform,
  rotate,
  move,
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
        transform,
        move,
        transformRotate: rotate,
        documentScale,
      }}>
      <div {...props}>{children}</div>
    </QueueObjectContainerContext.Provider>
  );
};
