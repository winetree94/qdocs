/* eslint-disable @typescript-eslint/naming-convention */
import { angle } from 'cdk/math/angle';
import { center } from 'cdk/math/center';
import clsx from 'clsx';
import { QueueObjectContainerContext } from 'components/queue/Container';
import { QueueAnimatableContext } from 'components/queue/QueueAnimation';
import { QueueRect } from 'model/property';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import styles from './Resizer.module.scss';

interface ResizeMatrix {
  a: 0 | 1;
  b: 0 | 1;
  c: 0 | 1;
  d: 0 | 1;
}

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

export const ObjectResizer = ({
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  onRotateStart,
  onRotateMove,
  onRotateEnd,
}: ResizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // shorthands
  const { selected, documentScale } = useContext(QueueObjectContainerContext);
  const animation = useContext(QueueAnimatableContext);

  const rect = animation.rect;
  const rotate = animation.rotate.degree;
  const scale = animation.scale.scale;

  // resizer meta
  const strokeWidth = 20;
  const distance = strokeWidth / 2;
  const margin = 100;

  const actualWidth = Math.abs(rect.width) + margin * 2;
  const actualHeight = Math.abs(rect.height) + margin * 2;

  const [rotatingDegree, setRotatingDegree] = React.useState<number | null>(
    null,
  );

  const [initResizeEvent, setInitResizeEvent] = React.useState<{
    event: MouseEvent;
    rect: QueueRect;
    position: ResizerPosition;
  } | null>(null);

  const [initRotateEvent, setInitRotateEvent] = React.useState<{
    event: MouseEvent;
    absRect: QueueRect;
    degree: number;
  } | null>(null);

  const matrix = React.useMemo<ResizeMatrix>(() => {
    if (!initResizeEvent) {
      return null;
    }
    const position = initResizeEvent.position;
    const a: 0 | 1 = ['bottom-right', 'top-right', 'middle-right'].includes(
      position,
    )
      ? 1
      : 0;
    const b: 0 | 1 = [
      'bottom-right',
      'bottom-left',
      'middle-left',
      'bottom-middle',
    ].includes(position)
      ? 1
      : 0;
    const c: 0 | 1 = a === 1 ? 0 : 1;
    const d: 0 | 1 = b === 1 ? 0 : 1;
    return { a, b, c, d };
  }, [initResizeEvent]);

  const startPositionToResize = React.useMemo<{
    qp0_x: number;
    qp0_y: number;
    pp_x: number;
    pp_y: number;
  }>(() => {
    if (!initResizeEvent || !matrix) {
      return null;
    }
    const theta: number = (Math.PI * 2 * rotate) / 360;
    const cos_t: number = Math.cos(theta);
    const sin_t: number = Math.sin(theta);

    const w: number = initResizeEvent.rect.width;
    const h: number = initResizeEvent.rect.height;
    const l: number = initResizeEvent.rect.x;
    const t: number = initResizeEvent.rect.y;

    const c0_x = l + w / 2.0;
    const c0_y = t + h / 2.0;

    const q0_x: number = l + matrix.a * w;
    const q0_y: number = t + matrix.b * h;

    const p0_x: number = l + matrix.c * w;
    const p0_y: number = t + matrix.d * h;

    const qp0_x =
      q0_x * cos_t - q0_y * sin_t - c0_x * cos_t + c0_y * sin_t + c0_x;
    const qp0_y =
      q0_x * sin_t + q0_y * cos_t - c0_x * sin_t - c0_y * cos_t + c0_y;

    const pp_x =
      p0_x * cos_t - p0_y * sin_t - c0_x * cos_t + c0_y * sin_t + c0_x;
    const pp_y =
      p0_x * sin_t + p0_y * cos_t - c0_x * sin_t - c0_y * cos_t + c0_y;

    return { qp0_x, qp0_y, pp_x, pp_y };
  }, [initResizeEvent, matrix, rotate]);

  const getAbsolutePosition = (): QueueRect => {
    const rect = svgRef.current.getBoundingClientRect();
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

  const getDelta = (
    initEvent: MouseEvent,
    currentEvent: MouseEvent,
    scale: number,
  ): { x: number; y: number } => {
    const currentX: number = currentEvent.clientX;
    const currentY: number = currentEvent.clientY;
    return {
      x: ['bottom-middle', 'top-middle'].includes(initResizeEvent.position)
        ? 0
        : (currentX - initEvent.clientX) * (1 / scale),
      y: ['middle-left', 'middle-right'].includes(initResizeEvent.position)
        ? 0
        : (currentY - initEvent.clientY) * (1 / scale),
    };
  };

  const getAbsoluteResizerPosition = useCallback(
    (
      initEvent: MouseEvent,
      targetEvent: MouseEvent,
      scale: number,
    ): ResizerEvent => {
      const delta = getDelta(initEvent, targetEvent, scale);

      // 스케일링된 포인트
      const qp_x: number = startPositionToResize.qp0_x + delta.x;
      const qp_y: number = startPositionToResize.qp0_y + delta.y;

      const cp_x: number = (qp_x + startPositionToResize.pp_x) / 2.0;
      const cp_y: number = (qp_y + startPositionToResize.pp_y) / 2.0;

      // 역 회전 변환 완료
      const mtheta: number = (-1 * Math.PI * 2 * rotate) / 360;
      const cos_mt: number = Math.cos(mtheta);
      const sin_mt: number = Math.sin(mtheta);

      let q_x: number =
        qp_x * cos_mt - qp_y * sin_mt - cos_mt * cp_x + sin_mt * cp_y + cp_x;
      let q_y: number =
        qp_x * sin_mt + qp_y * cos_mt - sin_mt * cp_x - cos_mt * cp_y + cp_y;

      let p_x: number =
        startPositionToResize.pp_x * cos_mt -
        startPositionToResize.pp_y * sin_mt -
        cos_mt * cp_x +
        sin_mt * cp_y +
        cp_x;
      let p_y: number =
        startPositionToResize.pp_x * sin_mt +
        startPositionToResize.pp_y * cos_mt -
        sin_mt * cp_x -
        cos_mt * cp_y +
        cp_y;

      const wtmp: number = matrix.a * (q_x - p_x) + matrix.c * (p_x - q_x);
      const htmp: number = matrix.b * (q_y - p_y) + matrix.d * (p_y - q_y);

      const w: number = Math.max(wtmp);
      const h: number = Math.max(htmp);

      const theta: number = -1 * mtheta;
      const cos_t: number = Math.cos(theta);
      const sin_t: number = Math.sin(theta);

      const dh_x: number = -sin_t * h;
      const dh_y: number = cos_t * h;

      const dw_x: number = cos_t * w;
      const dw_y: number = sin_t * w;

      const qp_x_min: number =
        startPositionToResize.pp_x +
        (matrix.a - matrix.c) * dw_x +
        (matrix.b - matrix.d) * dh_x;
      const qp_y_min: number =
        startPositionToResize.pp_y +
        (matrix.a - matrix.c) * dw_y +
        (matrix.b - matrix.d) * dh_y;

      const cp_x_min: number = (qp_x_min + startPositionToResize.pp_x) / 2.0;
      const cp_y_min: number = (qp_y_min + startPositionToResize.pp_y) / 2.0;

      q_x =
        qp_x_min * cos_mt -
        qp_y_min * sin_mt -
        cos_mt * cp_x_min +
        sin_mt * cp_y_min +
        cp_x_min;
      q_y =
        qp_x_min * sin_mt +
        qp_y_min * cos_mt -
        sin_mt * cp_x_min -
        cos_mt * cp_y_min +
        cp_y_min;

      p_x =
        startPositionToResize.pp_x * cos_mt -
        startPositionToResize.pp_y * sin_mt -
        cos_mt * cp_x_min +
        sin_mt * cp_y_min +
        cp_x_min;
      p_y =
        startPositionToResize.pp_x * sin_mt +
        startPositionToResize.pp_y * cos_mt -
        sin_mt * cp_x_min -
        cos_mt * cp_y_min +
        cp_y_min;

      const l: number = matrix.c * q_x + matrix.a * p_x;
      const t: number = matrix.d * q_y + matrix.b * p_y;

      return {
        x: l,
        y: t,
        width: w,
        height: h,
        degree: 0,
        scale: 1,
      };
    },
    [matrix, rotate, startPositionToResize],
  );

  const onResizeDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      const rect = getAbsoluteResizerPosition(
        initResizeEvent.event,
        event,
        documentScale,
      );
      onResizeMove?.({ ...rect, degree: 0, scale: 0 }, cancelResize);
    },
    [
      initResizeEvent,
      onResizeMove,
      documentScale,
      cancelResize,
      getAbsoluteResizerPosition,
    ],
  );

  const onResizeDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      const rect = getAbsoluteResizerPosition(
        initResizeEvent.event,
        event,
        documentScale,
      );
      onResizeEnd?.({ ...rect, degree: 0, scale: 0 });
      setInitResizeEvent(null);
    },
    [initResizeEvent, onResizeEnd, documentScale, getAbsoluteResizerPosition],
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
      position: ResizerPosition,
    ): void => {
      initEvent.stopPropagation();
      setInitResizeEvent({
        event: initEvent.nativeEvent,
        rect: { ...rect },
        position: position,
      });
      onResizeStart?.(
        {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          degree: 0,
          scale: 0,
        },
        cancelResize,
      );
    },
    [onResizeStart, cancelResize, rect],
  );

  const onRotateMousedown = useCallback(
    (
      initEvent: React.MouseEvent<SVGRectElement, globalThis.MouseEvent>,
    ): void => {
      initEvent.stopPropagation();
      const rect = getAbsolutePosition();
      const [centerX, centerY] = center(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
      );
      const degree = angle(
        centerX,
        centerY,
        initEvent.clientX,
        initEvent.clientY,
      );
      onRotateStart?.(
        {
          ...rect,
          degree: degree,
          scale: 0,
        },
        cancelRotate,
      );
      setInitRotateEvent({
        event: initEvent.nativeEvent,
        absRect: rect,
        degree: degree - rotate,
      });
    },
    [onRotateStart, cancelRotate, rotate],
  );

  const onRotateDocumentMousemove = useCallback(
    (event: MouseEvent) => {
      const { absRect } = initRotateEvent;
      const [centerX, centerY] = center(
        absRect.x,
        absRect.y,
        absRect.width,
        absRect.height,
      );
      const degree = Math.ceil(
        angle(centerX, centerY, event.clientX, event.clientY) -
          initRotateEvent.degree,
      );
      const adjacent = Math.round(degree / 5) * 5;
      setRotatingDegree(event.shiftKey ? degree : adjacent);
      onRotateMove?.(
        { ...absRect, degree: event.shiftKey ? degree : adjacent, scale: 0 },
        cancelRotate,
      );
    },
    [initRotateEvent, onRotateMove, cancelRotate],
  );

  const onRotateDocumentMouseup = useCallback(
    (event: MouseEvent) => {
      const { absRect } = initRotateEvent;
      const [centerX, centerY] = center(
        absRect.x,
        absRect.y,
        absRect.width,
        absRect.height,
      );
      const degree = Math.ceil(
        angle(centerX, centerY, event.clientX, event.clientY) -
          initRotateEvent.degree,
      );
      const adjacent = Math.round(degree / 5) * 5;
      setRotatingDegree(null);
      onRotateEnd?.({
        ...absRect,
        degree: event.shiftKey ? degree : adjacent,
        scale: 0,
      });
      setInitRotateEvent(null);
    },
    [initRotateEvent, onRotateEnd],
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
    <>
      <svg
        ref={svgRef}
        className={styles.canvas}
        style={{
          left: rect.width > 0 ? rect.x - margin : rect.x + rect.width - margin,
          top:
            rect.height > 0 ? rect.y - margin : rect.y + rect.height - margin,
          transformOrigin: 'center center',
          transform: `rotate(${rotate}deg) scale(${scale})`,
        }}
        width={actualWidth}
        height={actualHeight}>
        {/* top left */}
        <rect
          className={clsx(styles.resizer, styles.topLeft)}
          x={
            rect.width > 0
              ? margin - distance
              : actualWidth - margin - (strokeWidth - distance)
          }
          y={
            rect.height > 0
              ? margin - distance
              : actualHeight - margin - (strokeWidth - distance)
          }
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void => onResizeMousedown(e, 'top-left')}></rect>
        {/* top middle */}
        <rect
          className={clsx(styles.resizer, styles.topMiddle)}
          x={actualWidth / 2 - strokeWidth / 2}
          y={
            rect.height > 0
              ? margin - distance
              : actualHeight - margin - (strokeWidth - distance)
          }
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void => onResizeMousedown(e, 'top-middle')}></rect>
        {/* top right */}
        <rect
          className={clsx(styles.resizer, styles.topRight)}
          x={
            rect.width > 0
              ? actualWidth - margin - (strokeWidth - distance)
              : margin - distance
          }
          y={
            rect.height > 0
              ? margin - distance
              : actualHeight - margin - (strokeWidth - distance)
          }
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void => onResizeMousedown(e, 'top-right')}></rect>
        {/* middle right */}
        <rect
          className={clsx(styles.resizer, styles.middleRight)}
          x={
            rect.width > 0
              ? actualWidth - margin - (strokeWidth - distance)
              : margin - distance
          }
          y={actualHeight / 2 - strokeWidth / 2}
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void =>
            onResizeMousedown(e, 'middle-right')
          }></rect>
        {/* bottom right */}
        <rect
          className={clsx(styles.resizer, styles.bottomRight)}
          x={
            rect.width > 0
              ? actualWidth - margin - (strokeWidth - distance)
              : margin - distance
          }
          y={
            rect.height > 0
              ? actualHeight - margin - (strokeWidth - distance)
              : margin - distance
          }
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void =>
            onResizeMousedown(e, 'bottom-right')
          }></rect>
        {/* bottom middle */}
        <rect
          className={clsx(styles.resizer, styles.bottomMiddle)}
          x={actualWidth / 2 - strokeWidth / 2}
          y={
            rect.height > 0
              ? actualHeight - margin - (strokeWidth - distance)
              : margin - distance
          }
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void =>
            onResizeMousedown(e, 'bottom-middle')
          }></rect>
        {/* bottom left */}
        <rect
          className={clsx(styles.resizer, styles.bottomLeft)}
          x={
            rect.width > 0
              ? margin - distance
              : actualWidth - margin - (strokeWidth - distance)
          }
          y={
            rect.height > 0
              ? actualHeight - margin - (strokeWidth - distance)
              : margin - distance
          }
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void => onResizeMousedown(e, 'bottom-left')}></rect>
        {/* middle left */}
        <rect
          className={clsx(styles.resizer, styles.middleLeft)}
          x={
            rect.width > 0
              ? margin - distance
              : actualWidth - margin - (strokeWidth - distance)
          }
          y={actualHeight / 2 - strokeWidth / 2}
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void => onResizeMousedown(e, 'middle-left')}></rect>
        {/* rotation */}
        <rect
          className={clsx(styles.resizer, styles.rotation)}
          x={actualWidth - margin - (strokeWidth - distance) + 50}
          y={actualHeight - margin - (strokeWidth - distance) + 50}
          width={strokeWidth}
          height={strokeWidth}
          onMouseDown={(e): void => onRotateMousedown(e)}></rect>
      </svg>
      {rotatingDegree !== null && (
        <div
          className={clsx(styles.RotationDegree)}
          style={{
            left: rect.x - margin,
            top: rect.y - margin + animation.rect.height,
            width: actualWidth,
            height: actualHeight,
          }}>
          {rotatingDegree}°
        </div>
      )}
    </>
  );
};
