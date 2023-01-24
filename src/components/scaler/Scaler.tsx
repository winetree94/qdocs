import clsx from 'clsx';
import { FunctionComponent, ReactNode } from 'react';

export interface ScalerProps {
  width: number;
  height: number;
  scale: number;
  children?: ReactNode;
}

export const Scaler: FunctionComponent<ScalerProps> = ({
  scale,
  width,
  height,
  children,
}) => {
  return (
    <div
      className={clsx('p-2.5', 'm-auto')}
    >
      <div
        className={clsx('shrink-0')}
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        <div
          className={clsx('origin-top-left')}
          style={{
            transform: `scale(${scale})`
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
