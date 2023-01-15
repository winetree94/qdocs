/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';
import { QueueSquareRect } from '../../model/object/rect';
import styles from './Resizer.module.scss';

export interface ResizeEvent {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizerProps {
  scale?: number;
  rect: QueueSquareRect;
  onResizeStart?: (event: ResizeEvent, cancel: () => void) => void;
  onResizeMove?: (event: ResizeEvent, cancel: () => void) => void;
  onResizeEnd?: (event: ResizeEvent) => void;
}

export type ResizerPosition =
  | 'top-left'
  | 'top-middle'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-middle'
  | 'bottom-right';

export const Resizer: React.FunctionComponent<ResizerProps> = ({
  scale = 1,
  rect,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const container = useRef<SVGSVGElement>(null);
  const strokeWidth = 15;
  const distance = strokeWidth / 2;
  const margin = 50;
  const actualWidth = rect.width + margin * 2;
  const actualHeight = rect.height + margin * 2;

  const onResizeMousedown = (
    initEvent: React.MouseEvent<SVGRectElement, globalThis.MouseEvent>,
    position: ResizerPosition
  ): void => {
    initEvent.stopPropagation();

    if (!container.current) {
      return;
    }

    let newRect: QueueSquareRect = { ...rect };

    const mover = (event: MouseEvent): void => {
      setIsDrawing(true);

      const diffX = (event.clientX - initEvent.clientX) * (1 / scale);
      const diffY = (event.clientY - initEvent.clientY) * (1 / scale);

      switch (position) {
        case 'top-left':
          newRect = {
            x: -diffX,
            y: -diffY,
            width: -diffX,
            height: -diffY,
          };
          break;
        case 'top-middle':
          newRect = {
            x: 0,
            y: -diffY,
            width: 0,
            height: -diffY,
          };
          break;
        case 'top-right':
          newRect = {
            x: 0,
            y: -diffY,
            width: diffX,
            height: -diffY,
          };
          break;
        case 'middle-right':
          newRect = {
            x: 0,
            y: 0,
            width: diffX,
            height: 0,
          };
          break;
        case 'bottom-right':
          newRect = {
            x: 0,
            y: 0,
            width: diffX,
            height: diffY,
          };
          break;
        case 'bottom-middle':
          newRect = {
            x: 0,
            y: 0,
            width: 0,
            height: diffY,
          };
          break;
        case 'bottom-left':
          newRect = {
            x: -diffX,
            y: 0,
            width: -diffX,
            height: diffY,
          };
          break;
        case 'middle-left':
          newRect = {
            x: -diffX,
            y: 0,
            width: -diffX,
            height: 0,
          };
          break;
      }

      onResizeMove?.(newRect, cancel);
    };

    const finish = (event?: MouseEvent): void => {
      document.removeEventListener('mouseup', finish);
      document.removeEventListener('mousemove', mover);
      setIsDrawing(false);

      if (!event) {
        return;
      }

      onResizeEnd?.(newRect);
    };

    const cancel = (): void => {
      finish();
    };

    document.addEventListener('mousemove', mover);
    document.addEventListener('mouseup', finish, {
      once: true,
    });

    onResizeStart?.(newRect, cancel);
  };

  return (
    <svg
      ref={container}
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
        onMouseDown={(e): void => onResizeMousedown(e, 'top-left')}
      ></rect>
      {/* top middle */}
      <rect
        className={styles.topMiddle}
        x={actualWidth / 2 - strokeWidth / 2}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'top-middle')}
      ></rect>
      {/* top right */}
      <rect
        className={styles.topRight}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'top-right')}
      ></rect>
      {/* middle right */}
      <rect
        className={styles.middleRight}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={actualHeight / 2 - strokeWidth / 2}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'middle-right')}
      ></rect>
      {/* bottom right */}
      <rect
        className={styles.bottomRight}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'bottom-right')}
      ></rect>
      {/* bottom middle */}
      <rect
        className={styles.bottomMiddle}
        x={actualWidth / 2 - strokeWidth / 2}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'bottom-middle')}
      ></rect>
      {/* bottom left */}
      <rect
        className={styles.bottomLeft}
        x={margin - distance}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'bottom-left')}
      ></rect>
      {/* middle left */}
      <rect
        className={styles.middleLeft}
        x={margin - distance}
        y={actualHeight / 2 - strokeWidth / 2}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'middle-left')}
      ></rect>
    </svg>
  );
};
