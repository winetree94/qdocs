import { css } from '@emotion/css';
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
      style={{
        padding: '10px',
        margin: 'auto',
      }}
    >
      <div
        style={{
          width: width * scale,
          height: height * scale,
          background: 'white',
          flexShrink: 0,
        }}
      >
        <div
          className={css`
            transform-origin: 0 0;
            transform: scale(${scale});
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
