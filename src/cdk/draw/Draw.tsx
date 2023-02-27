/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './Draw.module.scss';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { Draggable } from 'cdk/drag/Drag';

export interface DrawEvent {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  width: number;
  height: number;
}

export interface DrawProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  threshold?: number;
  onDrawStart?: (event: DrawEvent) => void;
  onDrawMove?: (event: DrawEvent) => void;
  onDrawEnd?: (event: DrawEvent) => void;
}

export const Drawable = ({ threshold = 30, onDrawStart, onDrawMove, onDrawEnd, children, ...divProps }: DrawProps) => {
  const container = useRef<HTMLDivElement>(null);

  const [selectorPosition, setSelectorPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const getPos = (init: MouseEvent, event: MouseEvent): DrawEvent => {
    const containerRect = container.current.getBoundingClientRect();
    const initClientX = init.clientX;
    const initClientY = init.clientY;
    const initOffsetX = init.clientX - containerRect.x;
    const initOffsetY = init.clientY - containerRect.y;
    const movedX = event.clientX - containerRect.x - initOffsetX;
    const movedY = event.clientY - containerRect.y - initOffsetY;
    const startClientX = movedX >= 0 ? initClientX : initClientX + movedX;
    const startClientY = movedY >= 0 ? initClientY : initClientY + movedY;
    const startOffsetX = movedX >= 0 ? initOffsetX : initOffsetX + movedX;
    const startOfssetY = movedY >= 0 ? initOffsetY : initOffsetY + movedY;
    const width = Math.abs(movedX);
    const height = Math.abs(movedY);

    return {
      x: startOffsetX,
      y: startOfssetY,
      clientX: startClientX,
      clientY: startClientY,
      width: width,
      height: height,
    };
  };

  const drawStart = (initEvent: MouseEvent, currentEvent: MouseEvent) => {
    const pos = getPos(initEvent, currentEvent);
    setSelectorPosition(pos);
    onDrawStart?.(pos);
  };

  const drawMove = (initEvent: MouseEvent, currentEvent: MouseEvent) => {
    const pos = getPos(initEvent, currentEvent);
    setSelectorPosition(pos);
    onDrawMove?.(pos);
  };

  const drawEnd = (initEvent: MouseEvent, currentEvent: MouseEvent) => {
    const pos = getPos(initEvent, currentEvent);
    setSelectorPosition(null);
    onDrawEnd?.(pos);
  };

  return (
    <Draggable
      {...divProps}
      className={clsx(styles.Drawer, divProps.className)}
      ref={container}
      threshold={10}
      onActualDragStart={drawStart}
      onActualDragMove={drawMove}
      onActualDragEnd={drawEnd}>
      {children}
      {selectorPosition && (
        <div
          className={styles.Draw}
          style={{
            top: selectorPosition.y,
            left: selectorPosition.x,
            width: selectorPosition.width,
            height: selectorPosition.height,
          }}>
          <div className={clsx(styles.Preview, 'w-full', 'h-full')}></div>
        </div>
      )}
    </Draggable>
  );
};
