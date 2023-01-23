import clsx from 'clsx';
import { QueueObjectContainerContext } from 'components/queue/Container';
import { QueueAnimatableContext } from 'components/queue/QueueAnimation';
import React, { useCallback, useContext, useEffect } from 'react';
import { QueueRect } from '../../model/object/rect';
import styles from './Resizer.module.scss';

export interface ResizeEvent {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizerProps {
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

export const ObjectResizer: React.FunctionComponent<ResizerProps> = ({
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}) => {
  // shorthands
  const { transform, selected, documentScale } = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const strokeWidth = 20;
  const distance = strokeWidth / 2;
  const margin = 50;
  const actualWidth = (animation.rect.width + (transform?.width || 0)) + margin * 2;
  const actualHeight = animation.rect.height + (transform?.height || 0) + margin * 2;

  const [init, setInit] = React.useState<{
    event: MouseEvent;
    position: ResizerPosition;
  } | null>(null);

  const cancel = useCallback(() => {
    setInit(null);
  }, []);

  const getResizerPosition = (
    initEvent: MouseEvent,
    targetEvent: MouseEvent,
    scale: number,
    objectScale: number,
    position: ResizerPosition
  ): QueueRect => {
    const originDiffX = (targetEvent.clientX - initEvent.clientX) * (1 / scale);
    const originDiffY = (targetEvent.clientY - initEvent.clientY) * (1 / scale);
    const diffX = originDiffX * (1 / objectScale);
    const diffY = originDiffY * (1 / objectScale);

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

  const onDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      if (!init) {
        return;
      }
      const rect = getResizerPosition(init.event, event, documentScale, animation.scale.scale, init.position);
      onResizeMove?.(rect, cancel);
    },
    [init, onResizeMove, documentScale, animation.scale.scale, cancel]
  );

  const onDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      if (!init) {
        return;
      }
      const rect = getResizerPosition(init.event, event, documentScale, animation.scale.scale, init.position);
      onResizeEnd?.(rect);
      setInit(null);
    },
    [init, onResizeEnd, documentScale, animation.scale.scale]
  );

  useEffect(() => {
    if (!init) {
      return;
    }
    document.addEventListener('mousemove', onDocumentMousemove);
    document.addEventListener('mouseup', onDocumentMouseup);
    return () => {
      document.removeEventListener('mousemove', onDocumentMousemove);
      document.removeEventListener('mouseup', onDocumentMouseup);
    };
  }, [init, onDocumentMousemove, onDocumentMouseup]);

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
          cancel
        );
      }
      setInit({
        event: initEvent.nativeEvent,
        position: position,
      });
    },
    [onResizeStart, cancel]
  );

  if (!selected) {
    return null;
  }

  return (
    <svg
      className={styles.canvas}
      style={{
        left: animation.rect.x + transform.x - margin,
        top: animation.rect.y + transform.y -margin,
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
    </svg>
  );
};
