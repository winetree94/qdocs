/* eslint-disable @typescript-eslint/no-unused-vars */
import { angle } from 'cdk/math/angle';
import clsx from 'clsx';
import { QueueObjectContainerContext } from 'components/queue/Container';
import { QueueAnimatableContext } from 'components/queue/QueueAnimation';
import { QueueRect } from 'model/property';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import styles from './Resizer.module.scss';

export interface ResizeEvent {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RotateEvent {
  degree: number;
}

export interface ResizerProps {
  onResizeStart?: (event: ResizeEvent, cancel: () => void) => void;
  onResizeMove?: (event: ResizeEvent, cancel: () => void) => void;
  onResizeEnd?: (event: ResizeEvent) => void;
  onRotateStart?: (event: RotateEvent, cancel: () => void) => void;
  onRotateMove?: (event: RotateEvent, cancel: () => void) => void;
  onRotateEnd?: (event: RotateEvent) => void;
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
  const { transform, selected, documentScale, transformRotate } = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const strokeWidth = 20;
  const distance = strokeWidth / 2;
  const margin = 100;
  const actualWidth = (animation.rect.width + (transform?.width || 0)) + margin * 2;
  const actualHeight = animation.rect.height + (transform?.height || 0) + margin * 2;
  const rotate = animation.rotate.degree;
  console.log(rotate);

  const [initResizeEvent, setInitResizeEvent] = React.useState<{
    event: MouseEvent;
    position: ResizerPosition;
  } | null>(null);

  const [initRotateEvent, setInitRotateEvent] = React.useState<{
    event: MouseEvent;
    position: RotateEvent;
  } | null>(null);

  const cancelResize = useCallback(() => {
    setInitResizeEvent(null);
  }, []);

  const cancelRotate = useCallback(() => {
    setInitRotateEvent(null);
  }, []);

  const getResizerPosition = (
    initEvent: MouseEvent,
    targetEvent: MouseEvent,
    scale: number,
    position: ResizerPosition
  ): QueueRect => {
    const originDiffX = (targetEvent.clientX - initEvent.clientX) * (1 / scale);
    const originDiffY = (targetEvent.clientY - initEvent.clientY) * (1 / scale);
    const diffX = originDiffX * (1);
    const diffY = originDiffY * (1);

    switch (position) {
      case 'top-left':
        return {
          x: diffX,
          y: diffY,
          width: -diffX,
          height: -diffY,
        };
      case 'top-middle':
        return {
          x: 0,
          y: diffY,
          width: 0,
          height: -diffY,
        };
      case 'top-right':
        return {
          x: 0,
          y: diffY,
          width: diffX,
          height: -diffY,
        };
      case 'middle-right':
        return {
          x: 0,
          y: 0,
          width: diffX,
          height: 0,
        };
      case 'bottom-right':
        return {
          x: 0,
          y: 0,
          width: diffX,
          height: diffY,
        };
      case 'bottom-middle':
        return {
          x: 0,
          y: 0,
          width: 0,
          height: diffY,
        };
      case 'bottom-left':
        return {
          x: diffX,
          y: 0,
          width: -diffX,
          height: diffY,
        };
      case 'middle-left':
        return {
          x: diffX,
          y: 0,
          width: -diffX,
          height: 0,
        };
    }
  };

  const onResizeDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      if (!initResizeEvent) {
        return;
      }
      const rect = getResizerPosition(initResizeEvent.event, event, documentScale, initResizeEvent.position);
      onResizeMove?.(rect, cancelResize);
    },
    [initResizeEvent, onResizeMove, documentScale, cancelResize]
  );

  const onResizeDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      if (!initResizeEvent) {
        return;
      }
      const rect = getResizerPosition(initResizeEvent.event, event, documentScale, initResizeEvent.position);
      onResizeEnd?.(rect);
      setInitResizeEvent(null);
    },
    [initResizeEvent, onResizeEnd, documentScale]
  );

  useEffect(() => {
    if (!initResizeEvent) {
      return;
    }
    document.addEventListener('mousemove', onResizeDocumentMousemove);
    document.addEventListener('mouseup', onResizeDocumentMouseup);
    return () => {
      document.removeEventListener('mousemove', onResizeDocumentMousemove);
      document.removeEventListener('mouseup', onResizeDocumentMouseup);
    };
  }, [initResizeEvent, onResizeDocumentMousemove, onResizeDocumentMouseup]);

  const onResizeMousedown = useCallback(
    (
      initEvent: React.MouseEvent<SVGRectElement, globalThis.MouseEvent>,
      position: ResizerPosition
    ): void => {
      initEvent.stopPropagation();
      if (onResizeStart) {
        onResizeStart(
          {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          },
          cancelResize
        );
      }
      setInitResizeEvent({
        event: initEvent.nativeEvent,
        position: position,
      });
    },
    [onResizeStart, cancelResize]
  );

  const onRotateMousedown = useCallback(
    (initEvent: React.MouseEvent<SVGRectElement, globalThis.MouseEvent>): void => {
      initEvent.stopPropagation();
      if (onRotateStart) {
        onRotateStart(
          {
            degree: 0,
          },
          cancelRotate
        );
      }
      const rect = svgRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const degree = angle(centerX, centerY, initEvent.clientX, initEvent.clientY);
      setInitRotateEvent({
        event: initEvent.nativeEvent,
        position: {
          degree: degree,
        }
      });
    },
    [onRotateStart, cancelRotate]
  );

  const onRotateDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      if (!initRotateEvent) {
        return;
      }
      const rect = svgRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const degree = angle(centerX, centerY, event.clientX, event.clientY) - initRotateEvent.position.degree;
      onRotateMove?.({
        degree: degree,
      }, cancelRotate);
    },
    [initRotateEvent, onRotateMove, cancelRotate]
  );

  const onRotateDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      if (!initRotateEvent) {
        return;
      }
      const rect = svgRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const degree = angle(centerX, centerY, event.clientX, event.clientY) - initRotateEvent.position.degree;
      onRotateEnd?.({
        degree: degree,
      });
      setInitRotateEvent(null);
    },
    [initRotateEvent, onRotateEnd]
  );

  useEffect(() => {
    if (!initRotateEvent) {
      return;
    }
    document.addEventListener('mousemove', onRotateDocumentMousemove);
    document.addEventListener('mouseup', onRotateDocumentMouseup);
    return () => {
      document.removeEventListener('mousemove', onRotateDocumentMousemove);
      document.removeEventListener('mouseup', onRotateDocumentMouseup);
    };
  }, [initRotateEvent, onRotateDocumentMousemove, onRotateDocumentMouseup]);

  if (!selected) {
    return null;
  }

  return (
    <svg
      ref={svgRef}
      className={styles.canvas}
      style={{
        left: animation.rect.x + transform.x - margin,
        top: animation.rect.y + transform.y - margin,
        transformOrigin: 'center center',
        transform: `rotate(${animation.rotate.degree + transformRotate.degree}deg)`,
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
