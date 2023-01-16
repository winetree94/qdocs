import { css } from '@emotion/css';
import { FunctionComponent, ReactNode, useRef, useState } from 'react';

export interface DrawEvent {
  // fixed
  clientX: number;
  clientY: number;

  drawClientX: number;
  drawClientY: number;
  // adjusted
  drawOffsetX: number;
  drawOffsetY: number;
  // container
  width: number;
  height: number;
}

export interface DrawProps {
  scale?: number;
  children?: ReactNode;
  className?: string;
  drawer?: ReactNode;
  onDrawStart?: (event: DrawEvent, cancel: () => void) => void;
  onDrawMove?: (event: DrawEvent, cancel: () => void) => void;
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
    initEvent: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    if (!container.current) {
      return;
    }
    const containerRect = container.current.getBoundingClientRect();
    const initClientX = initEvent.clientX;
    const initClientY = initEvent.clientY;
    const initOffsetX = initEvent.clientX - containerRect.x;
    const initOffsetY = initEvent.clientY - containerRect.y;

    setPosition({
      x: initOffsetX,
      y: initOffsetY,
      width: 0,
      height: 0,
    });

    const mover = (event: MouseEvent): void => {
      if (
        Math.abs(event.clientX - initClientX) < 5 &&
        Math.abs(event.clientY - initClientY) < 5
      ) {
        return;
      }

      setIsDrawing(true);

      const movedX = event.clientX - containerRect.x - initOffsetX;
      const movedY = event.clientY - containerRect.y - initOffsetY;
      const startClientX = movedX >= 0 ? initClientX : initClientX + movedX;
      const startClientY = movedY >= 0 ? initClientY : initClientY + movedY;
      const startOffsetX = movedX >= 0 ? initOffsetX : initOffsetX + movedX;
      const startOfssetY = movedY >= 0 ? initOffsetY : initOffsetY + movedY;
      const width = Math.abs(movedX);
      const height = Math.abs(movedY);

      setPosition({
        x: startOffsetX,
        y: startOfssetY,
        width: width,
        height: height,
      });

      onDrawMove?.(
        {
          drawOffsetX: startOffsetX,
          drawOffsetY: startOfssetY,
          drawClientX: startClientX,
          drawClientY: startClientY,
          clientX: event.clientX,
          clientY: event.clientY,
          width: width,
          height: height,
        },
        cancel
      );
    };

    const finish = (event?: MouseEvent): void => {
      document.removeEventListener('mouseup', finish);
      document.removeEventListener('mousemove', mover);
      setIsDrawing(false);

      if (!event) {
        return;
      }

      const movedX = event.clientX - containerRect.x - initOffsetX;
      const movedY = event.clientY - containerRect.y - initOffsetY;
      const startClientX = movedX >= 0 ? initClientX : initClientX + movedX;
      const startClientY = movedY >= 0 ? initClientY : initClientY + movedY;
      const startX = movedX >= 0 ? initOffsetX : initOffsetX + movedX;
      const startY = movedY >= 0 ? initOffsetY : initOffsetY + movedY;
      const width = Math.abs(movedX);
      const height = Math.abs(movedY);

      onDrawEnd?.({
        clientX: event.clientX,
        clientY: event.clientY,
        drawOffsetX: startX,
        drawOffsetY: startY,
        drawClientX: startClientX,
        drawClientY: startClientY,
        width: width,
        height: height,
      });
    };

    const cancel = (): void => {
      finish();
    };

    document.addEventListener('mousemove', mover);
    document.addEventListener('mouseup', finish, {
      once: true,
    });

    onDrawStart?.(
      {
        clientX: initEvent.clientX,
        clientY: initEvent.clientY,
        drawClientX: initClientX,
        drawClientY: initClientY,
        drawOffsetX: initOffsetX,
        drawOffsetY: initOffsetY,
        width: 0,
        height: 0,
      },
      cancel
    );
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
