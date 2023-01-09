import { FunctionComponent } from 'react';
import styles from './Resizer.module.scss';

export interface ResizerProps {
  width: number;
  height: number;
  onResize?: () => void;
}

export const Resizer: FunctionComponent<ResizerProps> = ({ width, height }) => {
  const strokeWidth = 15;
  const distance = strokeWidth / 2;
  const margin = 50;
  const actualWidth = width + margin * 2;
  const actualHeight = height + margin * 2;

  return (
    <svg
      className={styles.canvas}
      style={{
        left: -margin,
        top: -margin,
      }}
      width={actualWidth}
      height={actualHeight}
    >
      {/* top left */}
      <rect
        className={styles.topLeft}
        x={margin - distance}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
      {/* top middle */}
      <rect
        className={styles.topMiddle}
        x={actualWidth / 2 - strokeWidth / 2}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
      {/* top right */}
      <rect
        className={styles.topRight}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
      {/* middle right */}
      <rect
        className={styles.middleRight}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={actualHeight / 2 - strokeWidth / 2}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
      {/* bottom right */}
      <rect
        className={styles.bottomRight}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
      {/* bottom middle */}
      <rect
        className={styles.bottomMiddle}
        x={actualWidth / 2 - strokeWidth / 2}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
      {/* bottom left */}
      <rect
        className={styles.bottomLeft}
        x={margin - distance}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
      {/* middle left */}
      <rect
        className={styles.middleLeft}
        x={margin - distance}
        y={actualHeight / 2 - strokeWidth / 2}
        width={strokeWidth}
        height={strokeWidth}
      ></rect>
    </svg>
  );
};
