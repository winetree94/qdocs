/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useEffect, useLayoutEffect, useState } from 'react';

interface DragThrosholdDetectorProps {
  initEvent: MouseEvent;
  threshold: number;
  onThreshold: (event: MouseEvent) => void;
  onMouseup: (event: MouseEvent) => void;
}

const GlobalDragThresholdDetector = ({ initEvent, threshold, onThreshold, onMouseup }: DragThrosholdDetectorProps) => {
  useLayoutEffect(() => {
    const moveListener = (event: MouseEvent) => {
      const startX = initEvent.clientX;
      const startY = initEvent.clientY;
      const targetX = event.clientX;
      const targetY = event.clientY;
      const isChanged = Math.abs(startX - targetX) > threshold || Math.abs(startY - targetY) > threshold;
      if (!isChanged) {
        return;
      }
      onThreshold(event);
    };
    const upListener = (event: MouseEvent) => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
      onMouseup(event);
    };
    document.addEventListener('mousemove', moveListener);
    document.addEventListener('mouseup', upListener);
    return () => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };
  }, [initEvent.clientX, initEvent.clientY, onMouseup, onThreshold, threshold]);
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

export interface DocumentEventListenerProps {
  onMousedown?: (event: MouseEvent) => void;
  onMousemove?: (event: MouseEvent) => void;
  onMouseup?: (event: MouseEvent) => void;
}

export const DocumentEventLitener = ({ onMousedown, onMousemove, onMouseup }: DocumentEventListenerProps) => {
  useEffect(() => {
    if (!onMousedown) {
      return;
    }
    document.addEventListener('mousedown', onMousedown);
    return () => {
      document.removeEventListener('mousedown', onMousedown);
    };
  }, [onMousedown]);

  useEffect(() => {
    if (!onMousemove) {
      return;
    }
    document.addEventListener('mousemove', onMousemove);
    return () => {
      document.removeEventListener('mousemove', onMousemove);
    };
  }, [onMousemove]);

  useEffect(() => {
    if (!onMouseup) {
      return;
    }
    document.addEventListener('mouseup', onMouseup);
    return () => {
      document.removeEventListener('mouseup', onMouseup);
    };
  }, [onMouseup]);

  return <></>;
};

export interface DraggableProps extends React.HTMLAttributes<HTMLDivElement> {
  threshold?: number;
  children?: React.ReactNode;
  onActualDragStart?: (initialEvent: MouseEvent, currentEvent: MouseEvent) => void;
  onActualDragMove?: (initialEvent: MouseEvent, currentEvent: MouseEvent) => void;
  onActualDragEnd?: (initialEvent: MouseEvent, currentEvent: MouseEvent) => void;
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
    const [moveMouseEvent, setMoveMouseEvent] = useState<MouseEvent>(null);
    const [thresholdReached, setThresholdReached] = useState(false);

    const onMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
      setInitMouseEvent(event.nativeEvent);
    };

    const globalMouseMove = (event: MouseEvent) => {
      setMoveMouseEvent(event);
    };

    const globalMouseUp = (event: MouseEvent) => {
      setInitMouseEvent(null);
      setMoveMouseEvent(null);
    };

    useEffect(() => {
      if (!initMouseEvent || !moveMouseEvent) {
        setThresholdReached(false);
        return;
      }
      const startX = initMouseEvent.clientX;
      const startY = initMouseEvent.clientY;
      const targetX = moveMouseEvent.clientX;
      const targetY = moveMouseEvent.clientY;
      const isChanged = Math.abs(startX - targetX) > threshold || Math.abs(startY - targetY) > threshold;
      if (!isChanged) {
        return;
      }
      setThresholdReached(true);
    }, [initMouseEvent, moveMouseEvent, threshold]);

    useEffect(() => {
      console.log('dragstart: ', thresholdReached);
    }, [thresholdReached]);

    return (
      <>
        <div ref={ref} {...props} onMouseDown={onMousedown}>
          {children}
        </div>
        <DocumentEventLitener
          onMousemove={initMouseEvent ? globalMouseMove : null}
          onMouseup={initMouseEvent ? globalMouseUp : null}
        />
        {/* {initMouseEvent && (
          <GlobalDragThresholdDetector
            initEvent={initMouseEvent}
            threshold={threshold}
            onThreshold={(event) => {
              setInitMouseEvent(null);
              setDetectMouseEvent(initMouseEvent);
              init(initMouseEvent, event);
            }}
            onMouseup={() => {
              setDetectMouseEvent(null);
              setInitMouseEvent(null);
            }}
          />
        )} */}
        {/* {detectMouseEvent && <GlobalDragDetector onMousemove={move} onMouseup={end} />} */}
      </>
    );
  },
);
