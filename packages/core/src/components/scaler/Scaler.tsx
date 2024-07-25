import clsx from 'clsx';
import React, { FunctionComponent, ReactNode } from 'react';
// import styles from './Scaler.module.scss';

export interface ScalerProps {
  width: number;
  height: number;
  scale: number;
  className?: string;
  children?: ReactNode;
}

export const Scaler: FunctionComponent<ScalerProps> = ({
  scale,
  width,
  height,
  className,
  children,
}) => {
  return (
    <div className={clsx(styles.Root, className)}>
      <div
        className={clsx(styles.ActualSizedContent)}
        style={{
          width: width * scale,
          height: height * scale,
        }}>
        <div
          className={clsx(styles.ScaledContent)}
          style={{
            width: width,
            height: height,
            transform: `scale(${scale})`,
          }}>
          <div
            className={styles.ActualContent}
            style={{
              width: width,
              height: height,
            }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
