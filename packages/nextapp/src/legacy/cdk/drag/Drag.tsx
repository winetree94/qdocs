import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

interface DragThrosholdDetectorProps {
  initEvent: MouseEvent;
  threshold: number;
  onThreshold: (event: MouseEvent) => void;
  onMouseup: (event: MouseEvent) => void;
}

const GlobalDragThresholdDetector = ({
  initEvent,
  threshold,
  onThreshold,
  onMouseup,
}: DragThrosholdDetectorProps) => {
  const hasThresholdReachedRef = useRef(false);

  const moveListener = useCallback(
    (event: MouseEvent) => {
      const startX = initEvent.clientX;
      const startY = initEvent.clientY;
      const targetX = event.clientX;
      const targetY = event.clientY;
      const isChanged =
        Math.abs(startX - targetX) > threshold ||
        Math.abs(startY - targetY) > threshold;
      if (!isChanged || hasThresholdReachedRef.current) {
        return;
      }
      hasThresholdReachedRef.current = true;
      onThreshold(event);
    },
    [initEvent, threshold, onThreshold],
  );

  const upListener = useCallback(
    (event: MouseEvent) => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
      onMouseup(event);
    },
    [moveListener, onMouseup],
  );

  useEffect(() => {
    document.addEventListener('mousemove', moveListener);
    document.addEventListener('mouseup', upListener);
    return () => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };
  }, [initEvent, threshold, onThreshold, moveListener, onMouseup, upListener]);
  return <></>;
};

interface DrawDetectorProps {
  onMousemove: (event: MouseEvent) => void;
  onMouseup: (event: MouseEvent) => void;
}

const GlobalDragDetector = ({ onMousemove, onMouseup }: DrawDetectorProps) => {
  useEffect(() => {
    const moveListener = (event: MouseEvent) => {
      onMousemove(event);
    };
    const upListener = (event: MouseEvent) => {
      onMouseup(event);
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };
    document.addEventListener('mousemove', moveListener);
    document.addEventListener('mouseup', upListener);
    return () => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };
  }, [onMousemove, onMouseup]);
  return <></>;
};

export interface DraggableProps extends React.HTMLAttributes<HTMLDivElement> {
  threshold?: number;
  children?: React.ReactNode;
  onActualDragStart?: (
    initialEvent: MouseEvent,
    currentEvent: MouseEvent,
  ) => void;
  onActualDragMove?: (
    initialEvent: MouseEvent,
    currentEvent: MouseEvent,
  ) => void;
  onActualDragEnd?: (
    initialEvent: MouseEvent,
    currentEvent: MouseEvent,
  ) => void;
}

/**
 * @description
 * 일정 좌표만큼 이동한 이후부터 실행되는 드래그 이벤트 핸들러
 */
export const Draggable = forwardRef<HTMLDivElement, DraggableProps>(
  (
    {
      threshold = 10,
      children,
      onMouseDown,
      onActualDragStart,
      onActualDragMove,
      onActualDragEnd,
      ...props
    }: DraggableProps,
    ref,
  ) => {
    const [initMouseEvent, setInitMouseEvent] = useState<MouseEvent>(null);
    const [detectMouseEvent, setDetectMouseEvent] = useState<MouseEvent>(null);

    const onMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
      setInitMouseEvent(event.nativeEvent);
      onMouseDown?.(event);
    };

    const init = (initialEvent: MouseEvent, currentEvent: MouseEvent) => {
      onActualDragStart?.(initialEvent, currentEvent);
    };

    const move = (currentEvent: MouseEvent) => {
      onActualDragMove?.(detectMouseEvent, currentEvent);
    };

    const end = (currentEvent: MouseEvent) => {
      onActualDragEnd?.(detectMouseEvent, currentEvent);
      setDetectMouseEvent(null);
    };

    return (
      <>
        <div ref={ref} {...props} onMouseDown={onMousedown}>
          {children}
        </div>
        {initMouseEvent && (
          <GlobalDragThresholdDetector
            initEvent={initMouseEvent}
            threshold={threshold}
            onThreshold={(event) => {
              init(initMouseEvent, event);
              setDetectMouseEvent(initMouseEvent);
              setInitMouseEvent(null);
            }}
            onMouseup={() => {
              setDetectMouseEvent(null);
              setInitMouseEvent(null);
            }}
          />
        )}
        {detectMouseEvent && (
          <GlobalDragDetector onMousemove={move} onMouseup={end} />
        )}
      </>
    );
  },
);
