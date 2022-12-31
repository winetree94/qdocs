import { css } from '@emotion/css';
import { FunctionComponent, ReactNode, useRef, useState } from 'react';

export interface DrawEvent {
  // relative
  offsetX: number;
  offestY: number;
  // fixed
  clientX: number;
  clientY: number;
  // adjusted
  drawX: number;
  drawY: number;
  // container
  width: number;
  height: number;
}

export interface DrawProps {
  scale?: number;
  children?: ReactNode;
  className?: string;
  drawer?: ReactNode;
  onDrawStart?: (event: DrawEvent) => void;
  onDrawMove?: (event: DrawEvent) => void;
  onDrawEnd?: (event: DrawEvent) => void;
}

const drawerStyle = css`
  position: relative;
`;

const drawStyle = css`
  position: absolute;
`;

export const Drawable: FunctionComponent<DrawProps> = ({
  children,
  className,
  drawer,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
}) => {
  const container = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const onMouseDown = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    if (!container.current) {
      return;
    }
    const containerRect = container.current.getBoundingClientRect();
    const initX = event.clientX - containerRect.x;
    const initY = event.clientY - containerRect.y;

    setPosition({
      x: initX,
      y: initY,
      width: 0,
      height: 0,
    });

    onDrawStart?.({
      offsetX: initX,
      offestY: initY,
      clientX: event.clientX,
      clientY: event.clientY,
      drawX: initX,
      drawY: initY,
      width: 0,
      height: 0,
    });

    const mover = (event: MouseEvent): void => {
      setIsDrawing(true);

      const movedX = event.clientX - containerRect.x - initX;
      const movedY = event.clientY - containerRect.y - initY;
      const startX = movedX >= 0 ? initX : initX + movedX;
      const startY = movedY >= 0 ? initY : initY + movedY;
      const width = Math.abs(movedX);
      const height = Math.abs(movedY);

      setPosition({
        x: startX,
        y: startY,
        width: width,
        height: height,
      });

      onDrawMove?.({
        offsetX: startX,
        offestY: startY,
        clientX: event.clientX,
        clientY: event.clientY,
        drawX: startX,
        drawY: startY,
        width: width,
        height: height,
      });
    };

    const finish = (event: MouseEvent): void => {
      document.removeEventListener('mouseup', finish);
      document.removeEventListener('mousemove', mover);
      setIsDrawing(false);

      const movedX = event.clientX - containerRect.x - initX;
      const movedY = event.clientY - containerRect.y - initY;
      const startX = movedX >= 0 ? initX : initX + movedX;
      const startY = movedY >= 0 ? initY : initY + movedY;
      const width = Math.abs(movedX);
      const height = Math.abs(movedY);

      onDrawEnd?.({
        offsetX: startX,
        offestY: startY,
        clientX: event.clientX,
        clientY: event.clientY,
        drawX: startX,
        drawY: startY,
        width: width,
        height: height,
      });
    };

    document.addEventListener('mousemove', mover);
    document.addEventListener('mouseup', finish, {
      once: true,
    });
  };

  return (
    <div
      className={drawerStyle + ' ' + className}
      ref={container}
      onMouseDown={onMouseDown}
    >
      {children}
      {isDrawing && (
        <div
          className={drawStyle}
          style={{
            top: position.y,
            left: position.x,
            width: position.width,
            height: position.height,
          }}
        >
          {drawer}
        </div>
      )}
    </div>
  );
};
