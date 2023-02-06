import clsx from 'clsx';
import { FunctionComponent, ReactNode } from 'react';
import styles from './Scaler.module.scss';

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
    <div
      className={clsx(
        styles.Root,
        className
      )}
    >
      <div
        className={clsx(
          styles.ActualSizer,
        )}
        style={{
          maxWidth: width * scale,
          maxHeight: height * scale,
        }}
      >
        <div
          className={clsx(
            styles.ScaledContent
          )}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
