import { css } from '@emotion/css';
import { FunctionComponent, ReactNode, useRef, useState } from 'react';

export interface DragProps {
  scale: number;
  children: ReactNode;
  className?: string;
  onDrawStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrawMove?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrawEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const drawerStyle = css`
  position: relative;
`;

const drawStyle = css`
  position: absolute;
  background: white;
  top: 0;
  left: 0;
  border: 1px solid gray;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const Drawable: FunctionComponent<DragProps> = ({
  children,
  className,
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
    console.log(containerRect, event);

    const initX = event.clientX - containerRect.x;
    const initY = event.clientY - containerRect.y;

    setPosition({
      x: initX,
      y: initY,
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
    };

    const finish = (event: MouseEvent): void => {
      console.log('finish');
      document.removeEventListener('mouseup', finish);
      document.removeEventListener('mousemove', mover);
      setIsDrawing(false);
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
        ></div>
      )}
    </div>
  );
};
