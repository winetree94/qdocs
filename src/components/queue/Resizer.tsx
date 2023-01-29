/* eslint-disable @typescript-eslint/no-unused-vars */
import { angle } from 'cdk/math/angle';
import { center } from 'cdk/math/center';
import clsx from 'clsx';
import { QueueObjectContainerContext } from 'components/queue/Container';
import { QueueAnimatableContext } from 'components/queue/QueueAnimation';
import { QueueRect } from 'model/property';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import styles from './Resizer.module.scss';

export interface ResizerEvent {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  degree: number;
}

export interface ResizerProps {
  onResizeStart?: (event: ResizerEvent, cancel: () => void) => void;
  onResizeMove?: (event: ResizerEvent, cancel: () => void) => void;
  onResizeEnd?: (event: ResizerEvent) => void;
  onRotateStart?: (event: ResizerEvent, cancel: () => void) => void;
  onRotateMove?: (event: ResizerEvent, cancel: () => void) => void;
  onRotateEnd?: (event: ResizerEvent) => void;
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

export const ObjectResizer: React.FunctionComponent<ResizerProps> = ({
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  onRotateStart,
  onRotateMove,
  onRotateEnd
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  // shorthands
  const {
    transform,
    selected,
    documentScale,
    transformRotate,
  } = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const rect = animation.rect;
  const rotate = animation.rotate.degree;

  // resizer meta
  const strokeWidth = 20;
  const distance = strokeWidth / 2;
  const margin = 100;
  const [resizingRect, setResizingRect] = React.useState<ResizerEvent | null>(null);

  const actualWidth = (resizingRect?.width || rect.width) + margin * 2;
  const actualHeight = (resizingRect?.height || rect.height) + margin * 2;

  const [initResizeEvent, setInitResizeEvent] = React.useState<{
    event: MouseEvent;
    rect: QueueRect;
    position: ResizerPosition;
  } | null>(null);

  const [initRotateEvent, setInitRotateEvent] = React.useState<{
    event: MouseEvent;
    // abs
    absRect: QueueRect;
    // degree
    degree: number;
  } | null>(null);

  const getAbsolutePosition = (): QueueRect => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: rect.x - margin,
      y: rect.y - margin,
      width: rect.width + margin * 2,
      height: rect.height + margin * 2,
    };
  };

  const cancelResize = useCallback(() => {
    setInitResizeEvent(null);
  }, []);

  const cancelRotate = useCallback(() => {
    setInitRotateEvent(null);
  }, []);

  const getAbsoluteResizerPosition = useCallback(
    (
      rect: QueueRect,
      initEvent: MouseEvent,
      targetEvent: MouseEvent,
      scale: number,
      position: ResizerPosition,
    ): ResizerEvent => {
      const originDiffX = (targetEvent.clientX - initEvent.clientX) * (1 / scale);
      const originDiffY = (targetEvent.clientY - initEvent.clientY) * (1 / scale);
      const diffX = originDiffX;
      const diffY = originDiffY;

      switch (position) {
        case 'top-left':
          return {
            x: rect.x + diffX,
            y: rect.y + diffY,
            width: rect.width + -diffX,
            height: rect.height + -diffY,
            degree: 0,
            scale: 1,
          };
        case 'top-middle':
          return {
            x: rect.x,
            y: rect.y + diffY,
            width: rect.width,
            height: rect.height + -diffY,
            degree: 0,
            scale: 1,
          };
        case 'top-right':
          return {
            x: rect.x,
            y: rect.y + diffY,
            width: rect.width + diffX,
            height: rect.height + -diffY,
            degree: 0,
            scale: 1,
          };
        case 'middle-right':
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width + diffX,
            height: rect.height,
            degree: 0,
            scale: 1,
          };
        case 'bottom-right':
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width + diffX,
            height: rect.height + diffY,
            degree: 0,
            scale: 1,
          };
        case 'bottom-middle':
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height + diffY,
            degree: 0,
            scale: 1,
          };
        case 'bottom-left':
          return {
            x: rect.x + diffX,
            y: rect.y,
            width: rect.width + -diffX,
            height: rect.height + diffY,
            degree: 0,
            scale: 1,
          };
        case 'middle-left':
          return {
            x: rect.x + diffX,
            y: rect.y,
            width: rect.width + -diffX,
            height: rect.height,
            degree: 0,
            scale: 1,
          };
      }
    },
    []
  );

  const onResizeDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      const rect = getAbsoluteResizerPosition(initResizeEvent.rect, initResizeEvent.event, event, documentScale, initResizeEvent.position);
      onResizeMove?.({ ...rect, degree: 0, scale: 0 }, cancelResize);
      setResizingRect(rect);
    },
    [initResizeEvent, onResizeMove, documentScale, cancelResize, getAbsoluteResizerPosition]
  );

  const onResizeDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      const rect = getAbsoluteResizerPosition(initResizeEvent.rect, initResizeEvent.event, event, documentScale, initResizeEvent.position);
      onResizeEnd?.({ ...rect, degree: 0, scale: 0 });
      setResizingRect(null);
      setInitResizeEvent(null);
    },
    [initResizeEvent, onResizeEnd, documentScale, getAbsoluteResizerPosition]
  );

  useEffect(() => {
    const cleaner = (): void => {
      document.removeEventListener('mousemove', onResizeDocumentMousemove);
      document.removeEventListener('mouseup', onResizeDocumentMouseup);
    };
    if (!initResizeEvent) {
      return cleaner();
    }
    document.addEventListener('mousemove', onResizeDocumentMousemove);
    document.addEventListener('mouseup', onResizeDocumentMouseup);
    return cleaner;
  }, [initResizeEvent, onResizeDocumentMousemove, onResizeDocumentMouseup]);

  const onResizeMousedown = useCallback(
    (
      initEvent: React.MouseEvent<SVGRectElement, globalThis.MouseEvent>,
      position: ResizerPosition
    ): void => {
      initEvent.stopPropagation();
      setInitResizeEvent({
        event: initEvent.nativeEvent,
        rect: { ...rect },
        position: position,
      });
      onResizeStart?.(
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          degree: 0,
          scale: 0,
        },
        cancelResize
      );
    },
    [onResizeStart, cancelResize, rect]
  );

  const onRotateMousedown = useCallback(
    (initEvent: React.MouseEvent<SVGRectElement, globalThis.MouseEvent>): void => {
      initEvent.stopPropagation();
      const rect = getAbsolutePosition();
      const [centerX, centerY] = center(rect.x, rect.y, rect.width, rect.height);
      const degree = angle(centerX, centerY, initEvent.clientX, initEvent.clientY);
      onRotateStart?.({ ...rect, degree: degree, scale: 0, }, cancelRotate);
      setInitRotateEvent({
        event: initEvent.nativeEvent,
        absRect: rect,
        degree: degree - rotate,
      });
    },
    [onRotateStart, cancelRotate, rotate]
  );

  const onRotateDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      const { absRect } = initRotateEvent;
      const [centerX, centerY] = center(absRect.x, absRect.y, absRect.width, absRect.height);
      const degree = angle(centerX, centerY, event.clientX, event.clientY) - initRotateEvent.degree;
      onRotateMove?.({ ...absRect, degree: degree, scale: 0, }, cancelRotate);
    },
    [initRotateEvent, onRotateMove, cancelRotate]
  );

  const onRotateDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      const { absRect } = initRotateEvent;
      const [centerX, centerY] = center(absRect.x, absRect.y, absRect.width, absRect.height);
      const degree = angle(centerX, centerY, event.clientX, event.clientY) - initRotateEvent.degree;
      onRotateEnd?.({ ...absRect, degree: degree, scale: 0, });
      setInitRotateEvent(null);
    },
    [initRotateEvent, onRotateEnd]
  );

  useEffect(() => {
    const cleaner = (): void => {
      document.removeEventListener('mousemove', onRotateDocumentMousemove);
      document.removeEventListener('mouseup', onRotateDocumentMouseup);
    };
    if (!initRotateEvent) {
      return cleaner();
    }
    document.addEventListener('mousemove', onRotateDocumentMousemove);
    document.addEventListener('mouseup', onRotateDocumentMouseup);
    return cleaner;
  }, [initRotateEvent, onRotateDocumentMousemove, onRotateDocumentMouseup]);

  if (!selected) {
    return null;
  }

  return (
    <svg
      ref={svgRef}
      className={styles.canvas}
      style={{
        left: (resizingRect?.x || rect.x) - margin,
        top: (resizingRect?.y || rect.y) - margin,
        transformOrigin: 'center center',
        transform: `rotate(${resizingRect?.degree || rotate}deg)`,
      }}
      width={actualWidth}
      height={actualHeight}
    >
      {/* top left */}
      <rect
        className={clsx(styles.resizer, styles.topLeft)}
        x={margin - distance}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'top-left')}
      ></rect>
      {/* top middle */}
      <rect
        className={clsx(styles.resizer, styles.topMiddle)}
        x={actualWidth / 2 - strokeWidth / 2}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'top-middle')}
      ></rect>
      {/* top right */}
      <rect
        className={clsx(styles.resizer, styles.topRight)}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={margin - distance}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'top-right')}
      ></rect>
      {/* middle right */}
      <rect
        className={clsx(styles.resizer, styles.middleRight)}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={actualHeight / 2 - strokeWidth / 2}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'middle-right')}
      ></rect>
      {/* bottom right */}
      <rect
        className={clsx(styles.resizer, styles.bottomRight)}
        x={actualWidth - margin - (strokeWidth - distance)}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'bottom-right')}
      ></rect>
      {/* bottom middle */}
      <rect
        className={clsx(styles.resizer, styles.bottomMiddle)}
        x={actualWidth / 2 - strokeWidth / 2}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'bottom-middle')}
      ></rect>
      {/* bottom left */}
      <rect
        className={clsx(styles.resizer, styles.bottomLeft)}
        x={margin - distance}
        y={actualHeight - margin - (strokeWidth - distance)}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'bottom-left')}
      ></rect>
      {/* middle left */}
      <rect
        className={clsx(styles.resizer, styles.middleLeft)}
        x={margin - distance}
        y={actualHeight / 2 - strokeWidth / 2}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onResizeMousedown(e, 'middle-left')}
      ></rect>
      {/* rotation */}
      <rect
        className={clsx(styles.resizer, styles.rotation)}
        x={actualWidth - margin - (strokeWidth - distance) + 50}
        y={actualHeight - margin - (strokeWidth - distance) + 50}
        width={strokeWidth}
        height={strokeWidth}
        onMouseDown={(e): void => onRotateMousedown(e)}
      ></rect>
    </svg>
  );
};
